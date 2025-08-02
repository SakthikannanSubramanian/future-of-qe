
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, selectDashboardData, selectDashboardStatus, selectDashboardError } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import styles from './Dashboard.module.css';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from 'recharts';

// Table and filter helpers
const unique = (arr) => Array.from(new Set(arr));

const Dashboard = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const data = useSelector(selectDashboardData);
  const status = useSelector(selectDashboardStatus);
  const error = useSelector(selectDashboardError);

  // Filters
  const [filters, setFilters] = useState({
    edl: '',
    manager: '',
    account: '',
    project: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Filtering logic
  const filteredAssessments = useMemo(() => {
    if (!data?.assessments) return [];
    return data.assessments.filter(a =>
      (!filters.edl || a.edl === filters.edl) &&
      (!filters.manager || a.manager === filters.manager) &&
      (!filters.account || a.account === filters.account) &&
      (!filters.project || a.projectName === filters.project) &&
      (!filters.search || a.projectName.toLowerCase().includes(filters.search.toLowerCase()) || a.manager.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }, [data, filters]);

  // Summary metrics
  const summary = useMemo(() => {
    if (!data) return { edl: {}, manager: {} };
    const edl = {};
    const manager = {};
    (data.filters?.edlOptions || []).forEach(e => edl[e] = 0);
    (data.filters?.managerOptions || []).forEach(m => manager[m] = 0);
    filteredAssessments.forEach(a => {
      edl[a.edl] = (edl[a.edl] || 0) + 1;
      manager[a.manager] = (manager[a.manager] || 0) + 1;
    });
    return { edl, manager };
  }, [data, filteredAssessments]);

  // Heatmap data
  const heatmapData = useMemo(() => {
    if (!filteredAssessments.length) return [];
    // Each row: project, each col: parameter, value: avg level
    const params = unique(filteredAssessments.flatMap(a => a.formattedResponses.map(r => r.Parameter)));
    return filteredAssessments.map(a => {
      const row = { project: a.projectName };
      params.forEach(p => {
        const param = a.formattedResponses.find(r => r.Parameter === p);
        row[p] = param ? Math.round(param.responses.reduce((acc, r) => acc + r.level, 0) / param.responses.length) : 0;
      });
      return row;
    });
  }, [filteredAssessments]);

  // Time series data
  const timeSeriesData = useMemo(() => {
    if (!filteredAssessments.length) return [];
    // Group by project+timestamp
    return filteredAssessments.map(a => ({
      project: a.projectName,
      timestamp: a.timestamp.slice(0, 10),
      maturity: Math.round(
        a.formattedResponses.reduce((acc, r) => acc + r.responses.reduce((s, q) => s + q.level, 0), 0) /
        a.formattedResponses.reduce((acc, r) => acc + r.responses.length, 0)
      ),
    }));
  }, [filteredAssessments]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!filteredAssessments.length) return [];
    // Avg per parameter
    const params = unique(filteredAssessments.flatMap(a => a.formattedResponses.map(r => r.Parameter)));
    return params.map(p => {
      let total = 0, count = 0;
      filteredAssessments.forEach(a => {
        const param = a.formattedResponses.find(r => r.Parameter === p);
        if (param) {
          total += param.responses.reduce((acc, r) => acc + r.level, 0);
          count += param.responses.length;
        }
      });
      return { parameter: p, avgLevel: count ? total / count : 0 };
    });
  }, [filteredAssessments]);

  // Table data
  const tableData = useMemo(() => {
    if (!filteredAssessments.length) return [];
    return filteredAssessments.map(a => ({
      id: a.id,
      project: a.projectName,
      account: a.account,
      manager: a.manager,
      edl: a.edl,
      timestamp: a.timestamp.slice(0, 10),
      maturity: Math.round(
        a.formattedResponses.reduce((acc, r) => acc + r.responses.reduce((s, q) => s + q.level, 0), 0) /
        a.formattedResponses.reduce((acc, r) => acc + r.responses.length, 0)
      ),
    }));
  }, [filteredAssessments]);

  // Table sorting
  const [sort, setSort] = useState({ key: 'timestamp', dir: 'desc' });
  const sortedTableData = useMemo(() => {
    return [...tableData].sort((a, b) => {
      if (sort.dir === 'asc') return a[sort.key] > b[sort.key] ? 1 : -1;
      return a[sort.key] < b[sort.key] ? 1 : -1;
    });
  }, [tableData, sort]);

  // Render
  if (status === 'loading') {
    return (
      <div className={styles.dashboard} data-testid="dashboard-loading">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <span className="loader" data-testid="dashboard-spinner">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className={styles.dashboard} data-testid="dashboard-error">
        <div className={styles.container}>
          <h2>Error loading dashboard: {error}</h2>
        </div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className={`${styles.dashboard} ${styles[theme]}`} data-testid="dashboard-root">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 data-testid="dashboard-title">Automation Maturity Dashboard</h1>
          <p>Visualize and analyze assessment results across projects, managers, and time.</p>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }} data-testid="dashboard-filters">
          <select data-testid="filter-edl" value={filters.edl} onChange={e => setFilters(f => ({ ...f, edl: e.target.value }))}>
            <option value="">All EDLs</option>
            {data.filters?.edlOptions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select data-testid="filter-manager" value={filters.manager} onChange={e => setFilters(f => ({ ...f, manager: e.target.value }))}>
            <option value="">All Managers</option>
            {data.filters?.managerOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select data-testid="filter-account" value={filters.account} onChange={e => setFilters(f => ({ ...f, account: e.target.value }))}>
            <option value="">All Accounts</option>
            {data.filters?.accountOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select data-testid="filter-project" value={filters.project} onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}>
            <option value="">All Projects</option>
            {data.filters?.projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input
            data-testid="filter-search"
            type="text"
            placeholder="Search project or manager..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{ flex: 1, minWidth: 180 }}
          />
        </div>

        {/* Summary metrics */}
        <div className={styles.grid} style={{ marginBottom: '2rem' }} data-testid="dashboard-summary">
          <div className={styles.card} data-testid="summary-edl">
            <h3>Projects by EDL</h3>
            <ul>
              {Object.entries(summary.edl).map(([edl, count]) => (
                <li key={edl}>{edl}: <b>{count}</b></li>
              ))}
            </ul>
          </div>
          <div className={styles.card} data-testid="summary-manager">
            <h3>Projects by Manager</h3>
            <ul>
              {Object.entries(summary.manager).map(([manager, count]) => (
                <li key={manager}>{manager}: <b>{count}</b></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visualizations */}
        <div className={styles.grid} style={{ marginBottom: '2rem' }} data-testid="dashboard-visualizations">
          {/* Heatmap */}
          <div className={styles.card} style={{ minHeight: 320 }} data-testid="dashboard-heatmap">
            <h3>Automation Maturity Heatmap</h3>
            {/* Simple heatmap using colored divs for each cell */}
            {heatmapData.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 4 }}>Project</th>
                      {Object.keys(heatmapData[0]).filter(k => k !== 'project').map(param => (
                        <th key={param} style={{ padding: 4 }}>{param}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row, i) => (
                      <tr key={row.project}>
                        <td style={{ padding: 4 }}>{row.project}</td>
                        {Object.entries(row).filter(([k]) => k !== 'project').map(([param, level]) => (
                          <td key={param} style={{ padding: 0 }}>
                            <div
                              title={`Level: ${level}`}
                              style={{
                                background: level === 4 ? '#4ade80' : level === 3 ? '#facc15' : level === 2 ? '#fbbf24' : level === 1 ? '#f87171' : '#e5e7eb',
                                color: '#222',
                                borderRadius: 4,
                                margin: 2,
                                minWidth: 32,
                                minHeight: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: 16,
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                              }}
                              data-testid={`heatmap-cell-${row.project}-${param}`}
                            >{level}</div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <b>Legend:</b> <span style={{ background: '#4ade80', padding: '2px 8px', borderRadius: 3 }}>4</span> Advanced
                  <span style={{ background: '#facc15', padding: '2px 8px', borderRadius: 3, marginLeft: 8 }}>3</span> Proficient
                  <span style={{ background: '#fbbf24', padding: '2px 8px', borderRadius: 3, marginLeft: 8 }}>2</span> Intermediate
                  <span style={{ background: '#f87171', padding: '2px 8px', borderRadius: 3, marginLeft: 8 }}>1</span> Beginner
                </div>
              </div>
            ) : <div>No data for heatmap.</div>}
          </div>

          {/* Time Series */}
          <div className={styles.card} style={{ minHeight: 320 }} data-testid="dashboard-timeseries">
            <h3>Automation Maturity Over Time</h3>
            {timeSeriesData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeSeriesData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="maturity" name="Avg Maturity Level" stroke="#6366f1" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div>No data for time series.</div>}
          </div>

          {/* Radar Chart */}
          <div className={styles.card} style={{ minHeight: 320 }} data-testid="dashboard-radar">
            <h3>Parameter Performance (Radar)</h3>
            {radarData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} outerRadius={80}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="parameter" />
                  <PolarRadiusAxis angle={30} domain={[0, 4]} />
                  <Radar name="Avg Level" dataKey="avgLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : <div>No data for radar chart.</div>}
          </div>
        </div>

        {/* Table */}
        <div className={styles.card} style={{ marginBottom: 32 }} data-testid="dashboard-table">
          <h3>Assessment Results Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th onClick={() => setSort(s => ({ key: 'project', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>Project</th>
                  <th onClick={() => setSort(s => ({ key: 'account', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>Account</th>
                  <th onClick={() => setSort(s => ({ key: 'manager', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>Manager</th>
                  <th onClick={() => setSort(s => ({ key: 'edl', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>EDL</th>
                  <th onClick={() => setSort(s => ({ key: 'timestamp', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>Timestamp</th>
                  <th onClick={() => setSort(s => ({ key: 'maturity', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer' }}>Maturity Level</th>
                </tr>
              </thead>
              <tbody>
                {sortedTableData.length ? sortedTableData.map(row => (
                  <tr key={row.id} data-testid={`table-row-${row.id}`}>
                    <td>{row.project}</td>
                    <td>{row.account}</td>
                    <td>{row.manager}</td>
                    <td>{row.edl}</td>
                    <td>{row.timestamp}</td>
                    <td>{row.maturity}</td>
                  </tr>
                )) : <tr><td colSpan={6}>No results found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
