
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, selectDashboardData, selectDashboardStatus, selectDashboardError } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import styles from './Dashboard.module.css';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from 'recharts';

// Table and filter helpers
const unique = (arr) => Array.from(new Set(arr));

// --- GraphCard component for chevron filter toggle ---
function GraphCard(props) {
  const { title, filters, setFilters, data, showFiltersDefault = false, chevronTestId, children } = props;
  const [showFilters, setShowFilters] = React.useState(showFiltersDefault);
  return (
    <div className={styles.card} style={{ minHeight: 320, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 8 }}
          aria-label="Show filters"
          data-testid={chevronTestId}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      {showFilters && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
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
            style={{ minWidth: 140 }}
          />
        </div>
      )}
      {children}
    </div>
  );
}

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

  // Summary metrics (cumulative, unique projects, based on UNFILTERED data)
  const summary = useMemo(() => {
    if (!data) return { edl: {}, manager: {}, totalProjects: 0 };
    const edl = {};
    const manager = {};
    const projectSet = new Set();
    (data.filters?.edlOptions || []).forEach(e => edl[e] = 0);
    (data.filters?.managerOptions || []).forEach(m => manager[m] = 0);
    (data.assessments || []).forEach(a => {
      projectSet.add(a.projectName);
      edl[a.edl] = (edl[a.edl] || 0) + 1;
      manager[a.manager] = (manager[a.manager] || 0) + 1;
    });
    return { edl, manager, totalProjects: projectSet.size };
  }, [data]);

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

  // ...existing code...
  return (
    <div className={`${styles.dashboard} ${styles[theme]}`} data-testid="dashboard-root">
      <div className={styles.container}>
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 data-testid="dashboard-title">Automation Maturity Dashboard</h1>
              <p>Visualize and analyze assessment results across projects, managers, and time.</p>
            </div>
          </div>
        </header>

        {/* --- Summary Metrics Section (cumulative, unique projects) --- */}
        <section style={{ display: 'flex', gap: '2rem', margin: '2rem 0', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ minWidth: 180, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#6366f1' }}>Projects with Submissions</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginTop: 8 }}>{summary.totalProjects}</div>
          </div>
          <div style={{ minWidth: 180, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#6366f1' }}>Owned by EDL</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginTop: 8 }}>{Object.values(summary.edl).reduce((a, b) => a + (b || 0), 0)}</div>
          </div>
          <div style={{ minWidth: 180, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#6366f1' }}>Owned by Manager</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginTop: 8 }}>{Object.values(summary.manager).reduce((a, b) => a + (b || 0), 0)}</div>
          </div>
        </section>

        {/* Visualizations with chevron filter toggles */}
        <div className={styles.grid} style={{ marginBottom: '2rem', gap: '2rem', alignItems: 'flex-start' }} data-testid="dashboard-visualizations">
          {/* Heatmap with chevron filter toggle */}
          <GraphCard
            title="Automation Maturity Heatmap"
            filters={filters}
            setFilters={setFilters}
            data={data}
            showFiltersDefault={false}
            chevronTestId="dashboard-heatmap-chevron"
          >
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
                      <tr key={row.project + '-' + Object.values(row).join('-') + '-' + i}>
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
          </GraphCard>

          {/* Time Series with chevron filter toggle */}
          <GraphCard
            title="Automation Maturity Over Time"
            filters={filters}
            setFilters={setFilters}
            data={data}
            showFiltersDefault={false}
            chevronTestId="dashboard-timeseries-chevron"
          >
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
          </GraphCard>

          {/* Radar Chart with chevron filter toggle */}
          <GraphCard
            title="Parameter Performance (Radar)"
            filters={filters}
            setFilters={setFilters}
            data={data}
            showFiltersDefault={false}
            chevronTestId="dashboard-radar-chevron"
          >
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
          </GraphCard>
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

       

        {/* Table */}
        <div className={styles.card} style={{ marginBottom: 32 }} data-testid="dashboard-table">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <h3>Assessment Results Table</h3>
            <div>
              <button
                style={{ marginRight: 8, padding: '6px 16px', borderRadius: 6, border: '1px solid #6366f1', background: '#fff', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  // Download CSV
                  const csv = [
                    ['Project', 'Account', 'Manager', 'EDL', 'Timestamp', 'Maturity Level'],
                    ...sortedTableData.map(row => [row.project, row.account, row.manager, row.edl, row.timestamp, row.maturity])
                  ].map(r => r.map(String).map(s => '"' + s.replace(/"/g, '""') + '"').join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'dashboard-assessments.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                data-testid="dashboard-download-btn"
              >Download</button>
              <button
                style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #6366f1', background: '#fff', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  // Email (open mail client with CSV as body)
                  const csv = [
                    ['Project', 'Account', 'Manager', 'EDL', 'Timestamp', 'Maturity Level'],
                    ...sortedTableData.map(row => [row.project, row.account, row.manager, row.edl, row.timestamp, row.maturity])
                  ].map(r => r.map(String).map(s => '"' + s.replace(/"/g, '""') + '"').join(',')).join('%0D%0A');
                  window.location.href = `mailto:?subject=Dashboard Assessment Data&body=${csv}`;
                }}
                data-testid="dashboard-email-btn"
              >Email</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
              <thead>
                <tr>
                  <th onClick={() => setSort(s => ({ key: 'project', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>Project</th>
                  <th onClick={() => setSort(s => ({ key: 'account', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>Account</th>
                  <th onClick={() => setSort(s => ({ key: 'manager', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>Manager</th>
                  <th onClick={() => setSort(s => ({ key: 'edl', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>EDL</th>
                  <th onClick={() => setSort(s => ({ key: 'timestamp', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>Timestamp</th>
                  <th onClick={() => setSort(s => ({ key: 'maturity', dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6' }}>Maturity Level</th>
                </tr>
              </thead>
              <tbody>
                {sortedTableData.length ? sortedTableData.map(row => (
                  <tr key={row.id} data-testid={`table-row-${row.id}`}>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.project}</td>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.account}</td>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.manager}</td>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.edl}</td>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.timestamp}</td>
                    <td style={{ border: '1px solid #d1d5db' }}>{row.maturity}</td>
                  </tr>
                )) : <tr><td colSpan={6} style={{ border: '1px solid #d1d5db' }}>No results found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
