import React from 'react';

/**
 * Skip-to-content link for keyboard and screen reader users.
 * Becomes visible on focus, allowing users to bypass navigation.
 * @returns {JSX.Element} The skip link component
 */
const SkipLink = React.memo(function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
});

export default SkipLink;
