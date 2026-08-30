import loginIllustration from '@/assets/images/img1.png';

export default function LoginHero() {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-12"
      style={{ background: 'var(--app-brand-gradient)', color: 'var(--app-brand-on)' }}
    >
      {/* Background illustration */}
      <img
        src={loginIllustration}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right center',
        }}
      />

      {/* Brand-colored scrim: strong on the left (behind the text), lighter on
          the right so the illustration stays visible. Keeps white text readable. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          // background:
          //   'linear-gradient(120deg, rgba(37,50,170,0.94) 0%, rgba(58,45,165,0.82) 45%, rgba(96,78,205,0.55) 100%)',
        }}
      />
    </div>
  );
}
