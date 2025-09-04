"use client";

import React, { useEffect, useState } from 'react';

interface Staff {
  id: string;
  name: string;
}
interface Prize {
  id: string;
  label: string;
}

export default function ManagerForm() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [staffId, setStaffId] = useState('');
  const [prizeId, setPrizeId] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // Load staff and prizes
  useEffect(() => {
    async function loadData() {
      try {
        const staffRes = await fetch('/api/staff/list');
        const staffJson = await staffRes.json();
        setStaff(staffJson.data || []);
        const prizesRes = await fetch('/api/prizes/list');
        const prizesJson = await prizesRes.json();
        setPrizes(prizesJson.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
    // restore manager from localStorage
    const storedManager = typeof window !== 'undefined' ? localStorage.getItem('lastManager') : null;
    if (storedManager) setManager(storedManager);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!staffId || !prizeId) {
      setStatus('Please select a staff member and prize.');
      return;
    }
    try {
      const res = await fetch('/api/redemptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, prizeId, redeemedAt: date, manager }),
      });
      if (!res.ok) {
        const error = await res.json();
        setStatus(error.error || 'Error submitting redemption.');
        return;
      }
      // save manager name for convenience
      if (manager) {
        localStorage.setItem('lastManager', manager);
      }
      setStatus('Redemption submitted!');
      // reset selections but keep date/manager
      setStaffId('');
      setPrizeId('');
    } catch (err) {
      console.error(err);
      setStatus('Unexpected error.');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Prize Redemption Form</h1>
      {status && (
        <div className="mb-4 p-3 rounded text-white" style={{ backgroundColor: status.includes('submitted') ? '#16a34a' : '#dc2626' }}>
          {status}
          {status === 'Redemption submitted!' && (
            <button
              type="button"
              onClick={() => setStatus(null)}
              className="ml-4 underline text-white"
            >
              Submit another
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="staff">
            Staff
          </label>
          <select
            id="staff"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>
              Select staff member
            </option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="prize">
            Prize
          </label>
          <select
            id="prize"
            value={prizeId}
            onChange={(e) => setPrizeId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>
              Select prize
            </option>
            {prizes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date">
            Redemption Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="manager">
            Manager (optional)
          </label>
          <input
            id="manager"
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Manager name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}