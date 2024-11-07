"use client";

import Balancer from "react-wrap-balancer";

export default function CTA() {
  return (
    <div className="mx-auto px-4 py-5 text-center">
      <h2 className="text-xl md:text-2xl">
        <Balancer>
          Too early to talk to an investor?
          <br />
          <a
            href="mailto:hi@basecase.vc?subject=hello!"
            className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
          >
            Talk to a developer.
          </a>
        </Balancer>
      </h2>
    </div>
  );
}
