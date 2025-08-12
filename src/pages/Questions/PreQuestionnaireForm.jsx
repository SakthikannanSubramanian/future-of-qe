import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Questions.module.css';
import { saveProjectDetails } from '../../redux/slices/projectSlice';
import { useTheme } from '../../hooks/useTheme';

// Dummy data for dropdowns
const MANAGERS = ['Manager A', 'Manager B', 'Manager C'];
const EDLS = ['EDL X', 'EDL Y', 'EDL Z'];
const PDLS = ['PDL 1', 'PDL 2', 'PDL 3'];

const initialState = {
  projectName: '',
  accountName: '',
  email: '',
  manager: '',
  edl: '',
  pdl: '',
};

export default function PreQuestionnaireForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const firstErrorRef = React.useRef(null);

  const validate = () => {
    const errs = {};
    if (!form.projectName.trim()) errs.projectName = 'Project Name is required';
    if (!form.accountName.trim()) errs.accountName = 'Account Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!form.manager) errs.manager = 'Manager is required';
    if (!form.edl) errs.edl = 'EDL is required';
    if (!form.pdl) errs.pdl = 'PDL is required';
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Remove error for this field as soon as user types/selects
    setErrors(prev => {
      const newErrs = { ...prev };
      delete newErrs[name];
      return newErrs;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Scroll to first error field
      setTimeout(() => {
        if (firstErrorRef.current) {
          firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorRef.current.focus();
        }
      }, 50);
      return;
    }
    // Simulate backend by storing in Redux
    await dispatch(saveProjectDetails({
      projectName: form.projectName,
      accountName: form.accountName,
      emailId: form.email,
      manager: form.manager,
      pdl: form.pdl,
      edl: form.edl,
    }));
    navigate('/questions');
  };

  // Simulate dropdown loading (skeleton)
  React.useEffect(() => {
    setLoadingDropdowns(true);
    const timer = setTimeout(() => {
      setLoadingDropdowns(false);
    }, 1000); // 1s skeleton loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.questions} ${styles[theme]}`} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2vw' }}>
      <form
        onSubmit={handleSubmit}
        className={styles.card}
        style={{
          maxWidth: 480,
          width: '100%',
          padding: 'clamp(20px, 5vw, 40px)',
          borderRadius: 20,
          boxShadow: '0 4px 24px #e0e7ef',
          background: 'var(--bg-secondary, #fff)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
        noValidate
      >
        <h2 style={{ textAlign: 'center', marginBottom: 12, color: 'var(--primary, #6366f1)', fontSize: 'clamp(1.3rem, 2vw, 2rem)' }}>
          Project & User Details
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>Project Name *</label>
          <input
            name="projectName"
            type="text"
            value={form.projectName}
            onChange={handleChange}
            className={styles.input + (errors.projectName ? ' ' + styles.errorInput : '')}
            style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.projectName ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.projectName ? '2px solid #f87171' : undefined }}
            ref={errors.projectName ? firstErrorRef : null}
            aria-invalid={!!errors.projectName}
            aria-describedby={errors.projectName ? 'projectName-error' : undefined}
          />
          {errors.projectName && <div id="projectName-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.projectName}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>Account Name *</label>
          <input
            name="accountName"
            type="text"
            value={form.accountName}
            onChange={handleChange}
            className={styles.input + (errors.accountName ? ' ' + styles.errorInput : '')}
            style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.accountName ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.accountName ? '2px solid #f87171' : undefined }}
            ref={errors.accountName && !errors.projectName ? firstErrorRef : null}
            aria-invalid={!!errors.accountName}
            aria-describedby={errors.accountName ? 'accountName-error' : undefined}
          />
          {errors.accountName && <div id="accountName-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.accountName}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>Email ID of the project representative *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input + (errors.email ? ' ' + styles.errorInput : '')}
            style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.email ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.email ? '2px solid #f87171' : undefined }}
            ref={errors.email && !errors.projectName && !errors.accountName ? firstErrorRef : null}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <div id="email-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.email}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>Manager *</label>
          {loadingDropdowns ? (
            <div className={styles.skeleton} style={{ height: 38, borderRadius: 8, background: '#e5e7eb', marginTop: 4 }} />
          ) : (
            <select
              name="manager"
              value={form.manager}
              onChange={handleChange}
              className={styles.input + (errors.manager ? ' ' + styles.errorInput : '')}
              style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.manager ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.manager ? '2px solid #f87171' : undefined }}
              ref={errors.manager && !errors.projectName && !errors.accountName && !errors.email ? firstErrorRef : null}
              aria-invalid={!!errors.manager}
              aria-describedby={errors.manager ? 'manager-error' : undefined}
            >
              <option value="">Select Manager</option>
              {MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
          {errors.manager && <div id="manager-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.manager}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>EDL (Engineering Delivery Lead) *</label>
          {loadingDropdowns ? (
            <div className={styles.skeleton} style={{ height: 38, borderRadius: 8, background: '#e5e7eb', marginTop: 4 }} />
          ) : (
            <select
              name="edl"
              value={form.edl}
              onChange={handleChange}
              className={styles.input + (errors.edl ? ' ' + styles.errorInput : '')}
              style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.edl ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.edl ? '2px solid #f87171' : undefined }}
              ref={errors.edl && !errors.projectName && !errors.accountName && !errors.email && !errors.manager ? firstErrorRef : null}
              aria-invalid={!!errors.edl}
              aria-describedby={errors.edl ? 'edl-error' : undefined}
            >
              <option value="">Select EDL</option>
              {EDLS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          )}
          {errors.edl && <div id="edl-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.edl}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          <label style={{ fontWeight: 500 }}>PDL (Project Delivery Lead) *</label>
          {loadingDropdowns ? (
            <div className={styles.skeleton} style={{ height: 38, borderRadius: 8, background: '#e5e7eb', marginTop: 4 }} />
          ) : (
            <select
              name="pdl"
              value={form.pdl}
              onChange={handleChange}
              className={styles.input + (errors.pdl ? ' ' + styles.errorInput : '')}
              style={{ fontSize: '1rem', padding: '10px', borderRadius: 8, border: errors.pdl ? '2px solid #f87171' : '1px solid #d1d5db', outline: errors.pdl ? '2px solid #f87171' : undefined }}
              ref={errors.pdl && !errors.projectName && !errors.accountName && !errors.email && !errors.manager && !errors.edl ? firstErrorRef : null}
              aria-invalid={!!errors.pdl}
              aria-describedby={errors.pdl ? 'pdl-error' : undefined}
            >
              <option value="">Select PDL</option>
              {PDLS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          {errors.pdl && <div id="pdl-error" className={styles.error} style={{ fontSize: '0.92em', marginTop: 2, marginBottom: 0, color: '#f87171', minHeight: 0, lineHeight: 1.2 }}>{errors.pdl}</div>}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          style={{
            width: '100%',
            padding: '14px',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 10,
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 2px 8px #e0e7ef',
            transition: 'background 0.2s',
          }}
        >
          Go To Questions
        </button>
      </form>
    </div>
  );
}
