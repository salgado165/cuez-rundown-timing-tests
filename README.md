# Part 3 — Rundown timing checks

## Approach

I chose the timing rules because they are important to the producer's decisions and can be checked quickly and consistently. These two tests cover floated items, total duration, over/under, back-times, valid duration limits, and keeping the previous value after invalid input.

## What I did not automate

These tests do not check the actual Cuez interface, multiple users editing together, teleprompter or automation updates, or the live Take next workflow. Those need a real test environment and should also be checked manually.

## Requirements

- Node.js 18 or newer
- No additional packages are needed

## Run the tests

From this folder, run:

```sh
npm test
```

## Assumptions

- Durations use `mm:ss`; the maximum is `59:59`.
- Invalid durations are rejected and the previous value stays unchanged.
- Floated items are left out of timing and back-times.
- Start and hard-out times are on the same day. Testing across midnight would be a useful next step.

## With more time

I would add checks around each time limit, a rundown exactly on the hard out, and changes made by multiple users.
