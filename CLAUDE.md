# justto-web-legacy — agent guide

## Purpose and stack

Justto Web 2.0. Detected stack: **Vue**. Confirm behavior in the versioned code and configuration; this summary is routing context, not a substitute for implementation evidence.

## Read progressively

- `README.md`
- `README.MD`
- `package.json`
- `src`
- `.github/workflows`

Read the narrowest owning path first, then trace callers, persistence or messaging adapters, configuration, tests and deployment definitions affected by the change. Repository-local README, manifests and CI are authoritative.

## Commands discovered from manifests

```bash
yarn run build
yarn run lint
```

Run the focused relevant check first and the broader gate in proportion to risk. Private registries, services or credentials may be required; report that dependency instead of bypassing it.

## Autonomous delivery

1. Establish current behavior and observable acceptance criteria.
2. Preserve unrelated work and make the smallest coherent change.
3. Add focused coverage for changed behavior and run proportional local proof.
4. Review the full diff, contracts, configuration and operational impact.
5. Unless the request limits scope, continue through semantic commit, principal-branch integration, push, official deploy observation and real behavior validation.

Escalate only for a real product decision, missing authority, secret, material cost, destructive data/infrastructure action or unsafe ambiguity. Do not pause for routine implementation, test, commit or push checkpoints.

## Invariants and safety

- Do not invent commands, endpoints, events, payloads, environment variables or successful validation.
- Treat auth, tenant isolation, personal/legal data, billing and external-provider credentials as sensitive boundaries.
- Keep API/message contracts backward compatible unless every consumer and migration path is in scope.
- Change desired infrastructure state in versioned manifests; never use an ad hoc production edit as the delivered fix.
- Record skipped gates and residual risk exactly. A green structural check is not proof of the end-user journey.
