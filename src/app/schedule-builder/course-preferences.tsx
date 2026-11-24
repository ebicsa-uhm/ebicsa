'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Modal } from 'react-bootstrap';
import type { CoursePreferences } from '@/lib/schedule-builder';

function inputTime(minutes?: number) {
  if (minutes === undefined) return '';

  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}

function readTime(value: FormDataEntryValue | null) {
  if (!value) return undefined;

  const [hours, minutes] = String(value).split(':').map(Number);
  return hours * 60 + minutes;
}

export default function CoursePreferencesModal({
  code, weekdays, preferences, onClose, onApply,
}: {
  code: string;
  weekdays: string[];
  preferences?: CoursePreferences;
  onClose: () => void;
  onApply: (preferences?: CoursePreferences) => void;
}) {
  const [error, setError] = useState('');

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = new FormData(event.currentTarget);
    const days = values.getAll('days').map(String);
    const format = String(values.get('format'));
    const start = readTime(values.get('start'));
    const end = readTime(values.get('end'));

    if (start !== undefined && end !== undefined && start >= end) {
      setError('Choose an end time after the start time.');
      return;
    }

    if (days.length === 0 && format === 'inherit' && start === undefined && end === undefined) {
      onApply();
      return;
    }

    onApply({
      days: days.length ? days : undefined,
      format: format === 'inherit' ? undefined : format,
      start,
      end,
    });
  }

  return (
    <Modal show onHide={onClose} centered aria-labelledby="course-preferences-title">
      <Modal.Header closeButton>
        <Modal.Title id="course-preferences-title">Edit {code} preferences</Modal.Title>
      </Modal.Header>

      <form onSubmit={apply}>
        <Modal.Body>
          <fieldset className="mb-3">
            <legend className="fs-6 fw-semibold">Available days</legend>
            <div className="d-flex flex-wrap gap-3">
              {weekdays.map((day) => (
                <label key={day}>
                  <input
                    className="form-check-input me-1"
                    type="checkbox"
                    name="days"
                    value={day}
                    defaultChecked={preferences?.days?.includes(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            <p className="form-text mb-0">Leave all days unchecked to use the builder’s days.</p>
          </fieldset>

          <label className="form-label fw-semibold" htmlFor="course-format">Class format</label>
          <select
            id="course-format"
            name="format"
            className="form-select mb-3"
            defaultValue={preferences?.format ?? 'inherit'}
          >
            <option value="inherit">Use builder setting</option>
            <option value="">Any format</option>
            <option value="In-Person">In person</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>

          <fieldset>
            <legend className="fs-6 fw-semibold">Time window</legend>
            <div className="d-flex flex-wrap gap-3">
              <label>
                Start time
                <input className="form-control" type="time" name="start" defaultValue={inputTime(preferences?.start)} />
              </label>
              <label>
                End time
                <input className="form-control" type="time" name="end" defaultValue={inputTime(preferences?.end)} />
              </label>
            </div>
            <p className="form-text mb-0">Blank times use the builder’s time window.</p>
          </fieldset>

          {error && <p className="text-danger mt-2 mb-0" role="alert">{error}</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="outline-secondary" onClick={() => onApply()}>
            Use builder defaults
          </Button>
          <Button type="submit" variant="success">Apply preferences</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}