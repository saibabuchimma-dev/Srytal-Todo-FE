import loginIllustration from '@/assets/images/img1.png';

export default function LoginHero() {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-12"
      style={{ background: 'var(--app-brand-gradient)', color: 'var(--app-brand-on)' }}
    >
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

      <div aria-hidden />
    </div>
  );
}
