import type { ReactNode } from 'react';
import {
  AppShell,
  Badge,
  Button,
  Card,
  HStack,
  Link,
  Section,
  Text,
  TopNav,
  VStack,
  useAppShellMobile,
} from '@astryxdesign/core';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';

// Shared showcase chrome: top bar plus centered section plus footer.
// Template detail pages keep their minimal breadcrumb bar instead.
//
// Responsive contract: below 768px, which is AppShell's `md` breakpoint, TopNav
// renders its mobile bar and the section links drop into the AppShell drawer
// behind the hamburger toggle. The wordmark, the dark-only badge, and the
// GitHub/llms.txt links stay above the breakpoint; the logo keeps the brand
// name, and the footer card carries both links at every width.
const NAV_LINKS = [
  { href: '#palette', label: 'Palette' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#components', label: 'Components' },
  { href: '#quickstart', label: 'Quickstart' },
  { href: '#/templates', label: 'Templates' },
  { href: '#/bento', label: 'Bento' },
];

// TopNav renders this list twice: inline in the bar above the breakpoint, and
// stacked inside the drawer below it. Collapsing the drawer on click is a no-op
// above the breakpoint, so both placements can share the same handler.
function SiteNavLinks({ isVertical }: { isVertical: boolean }) {
  const { closeMobileNav } = useAppShellMobile();
  const links = NAV_LINKS.map((link) => (
    <Link key={link.href} href={link.href} onClick={closeMobileNav}>
      {link.label}
    </Link>
  ));
  return isVertical ? (
    <VStack gap={2}>{links}</VStack>
  ) : (
    <HStack gap={3} vAlign="center">
      {links}
    </HStack>
  );
}

export function SiteShell({
  children,
  ctaHref,
  onCta,
}: {
  children: ReactNode;
  ctaHref?: string;
  onCta?: () => void;
}) {
  const narrow = useMediaQuery('(max-width: 768px)');

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <AppShell
        height="auto"
        contentPadding={0}
        topNav={
          <TopNav
            heading={
              <HStack gap={1.5} vAlign="center">
                <svg width="20" height="20" viewBox="0 0 96 96" role="img" aria-label="Astryx Dracula">
                  <path
                    fill="var(--dracula-purple)"
                    d="M26.88 0c8.483 0 15.36 6.877 15.36 15.36v13.92a4.8 4.8 0 0 0 4.8 4.8h1.92a4.8 4.8 0 0 0 4.8-4.8V15.36C53.76 6.877 60.637 0 69.12 0h21.12A5.76 5.76 0 0 1 96 5.76v21.12c0 8.483-6.877 15.36-15.36 15.36H66.72a4.8 4.8 0 0 0-4.8 4.8v1.92a4.8 4.8 0 0 0 4.8 4.8h13.92c8.483 0 15.36 6.877 15.36 15.36v21.12A5.76 5.76 0 0 1 90.24 96H69.12c-8.483 0-15.36-6.877-15.36-15.36V66.72a4.8 4.8 0 0 0-4.8-4.8h-1.92a4.8 4.8 0 0 0-4.8 4.8v13.92c0 8.483-6.877 15.36-15.36 15.36H5.76A5.76 5.76 0 0 1 0 90.24V69.12c0-8.483 6.877-15.36 15.36-15.36h13.92a4.8 4.8 0 0 0 4.8-4.8v-1.92a4.8 4.8 0 0 0-4.8-4.8H15.36C6.877 42.24 0 35.363 0 26.88V5.76A5.76 5.76 0 0 1 5.76 0z"
                  />
                </svg>
                {/* Mobile bar holds the logo plus the CTA and the menu toggle;
                    the wordmark would push them off a 320px viewport. The logo
                    carries the same name as its accessible label. */}
                {!narrow && <Text weight="semibold">Astryx Dracula</Text>}
                {!narrow && <Badge label="dark-only" variant="purple" />}
              </HStack>
            }
            startContent={<SiteNavLinks isVertical={narrow} />}
            endContent={
              <HStack gap={2} vAlign="center">
                {!narrow && (
                  <>
                    <Link href="https://github.com/yuzu-octopus/astryx-dracula" isExternalLink>
                      GitHub
                    </Link>
                    <Link href="./llms.txt">llms.txt</Link>
                  </>
                )}
                <Button label="Use this theme" variant="primary" href={ctaHref} onClick={onCta} />
              </HStack>
            }
          />
        }
      >
        <Section
          variant="transparent"
          padding={0}
          style={{
            maxWidth: '1160px',
            marginInline: 'auto',
            width: '100%',
            paddingInline: 'var(--spacing-4)',
            paddingBlock: 'var(--spacing-8)',
          }}
        >
          <VStack gap={10}>
            {children}
            <Card
              padding={4}
              style={{
                backgroundColor: 'var(--color-background)',
                border: 'var(--border-width) solid var(--color-separator)',
              }}
            >
              <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
                <VStack gap={0.5}>
                  <Text weight="semibold">Astryx Dracula Theme</Text>
                  <Text type="supporting" color="secondary">
                    Copy the kit, read the skill, ship dark interfaces. Dracula spec at{' '}
                    <Link href="https://draculatheme.com" target="_blank" rel="noopener noreferrer">
                      draculatheme.com
                    </Link>
                    .
                  </Text>
                </VStack>
                <HStack gap={2} vAlign="center">
                  <Link href="https://github.com/yuzu-octopus/astryx-dracula" isExternalLink>
                    GitHub
                  </Link>
                  <Link href="./llms.txt">llms.txt</Link>
                </HStack>
              </HStack>
            </Card>
          </VStack>
        </Section>
      </AppShell>
    </Theme>
  );
}
