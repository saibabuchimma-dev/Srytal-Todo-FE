import { CHART_BLUE } from '../constants/chart';

interface TooltipPayloadEntry {
  name?: string | number;
  value?: string | number;
  color?: string;
  payload?: { name?: string; fill?: string };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
  colorByName?: Record<string, string>;
}

/**
 * Shared tooltip for the report charts. Recharts injects `active`, `payload`
 * and `label` when the element is passed to <Tooltip content={...} />.
 */
export default function ChartTooltip({ active, payload, label, colorByName }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const hasAxisLabel = label !== undefined && label !== null && String(label) !== '';
  const header = hasAxisLabel
    ? String(label)
    : String(payload[0]?.name ?? payload[0]?.payload?.name ?? '');

  return (
    <div
      style={{
        background: 'var(--mantine-color-body)',
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 8,
        padding: '8px 10px',
        boxShadow: 'var(--mantine-shadow-md)',
        minWidth: 120,
      }}
    >
      {header && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--mantine-color-text)',
            marginBottom: 4,
          }}
        >
          {header}
        </div>
      )}

      {payload.map((entry, index) => {
        const rawName = String(entry.name ?? entry.payload?.name ?? '');
        const isGeneric = rawName === 'value' || rawName === 'count';
        const showName = hasAxisLabel && !isGeneric;
        const color =
          entry.color ?? entry.payload?.fill ?? colorByName?.[header] ?? CHART_BLUE;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--mantine-color-dimmed)',
            }}
          >
            <span
              style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block' }}
            />
            {showName && <span>{rawName}</span>}
            <span
              style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--mantine-color-text)' }}
            >
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
