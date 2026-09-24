import {
  Skeleton as MantineSkeleton,
  type SkeletonProps as MantineSkeletonProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export type SkeletonProps = MantineSkeletonProps;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, style, radius = 'md', ...props }, ref) => {
    return (
      <MantineSkeleton
        ref={ref}
        radius={radius}
        className={className}
        style={style}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
export default Skeleton;

export function CardSkeleton() {
  return (
    <div className="animate-in" style={{ animationDelay: '0ms' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            height: 180,
            borderRadius: 12,
            background: 'var(--app-surface-2)',
          }}
          className="animate-shimmer"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '8px 0',
          }}
        >
          <div
            style={{
              height: 24,
              width: '60%',
              borderRadius: 8,
              background: 'var(--app-surface-2)',
            }}
            className="animate-shimmer"
          />
          <div
            style={{
              height: 14,
              width: '80%',
              borderRadius: 4,
              background: 'var(--app-surface-2)',
            }}
            className="animate-shimmer"
          />
          <div
            style={{
              height: 14,
              width: '45%',
              borderRadius: 4,
              background: 'var(--app-surface-2)',
            }}
            className="animate-shimmer"
          />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="animate-in-stagger" style={{ animationDelay: '50ms' }}>
      <div
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--app-border)',
        }}
      >
        <div style={{ height: 48, background: 'var(--app-surface-2)' }} />
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                padding: '12px 16px',
                borderBottom: '1px solid var(--app-border)',
                background:
                  i % 2 === 0 ? 'var(--app-surface)' : 'var(--app-surface-2)',
              }}
            >
              {Array.from({ length: columns }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: 16,
                    width: '75%',
                    borderRadius: 4,
                    background: 'var(--app-surface-hover)',
                  }}
                  className="animate-shimmer"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-in-stagger" style={{ animationDelay: '0ms' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 110,
                borderRadius: 16,
                background: 'var(--app-surface-2)',
              }}
              className="animate-shimmer"
            />
          ))}
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 300,
                borderRadius: 16,
                background: 'var(--app-surface-2)',
              }}
              className="animate-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="animate-in-stagger" style={{ animationDelay: '50ms' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {Array.from({ length: 3 }).map((_, col) => (
          <div
            key={col}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              minHeight: 400,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  height: 20,
                  width: 100,
                  borderRadius: 6,
                  background: 'var(--app-surface-2)',
                }}
                className="animate-shimmer"
              />
              <div
                style={{
                  height: 20,
                  width: 32,
                  borderRadius: 9999,
                  background: 'var(--app-surface-2)',
                }}
                className="animate-shimmer"
              />
            </div>
            {Array.from({ length: 3 }).map((_, row) => (
              <div
                key={row}
                style={{
                  height: 96,
                  borderRadius: 12,
                  background: 'var(--app-surface-2)',
                }}
                className="animate-shimmer"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
