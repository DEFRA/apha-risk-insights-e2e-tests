#!/bin/sh

echo "run_id: $RUN_ID"

npm test
test_exit_code=$?

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# If the suite failed, write a 'FAILED' marker file and exit non-zero so the
# CDP portal records the run as failed.
if [ $test_exit_code -ne 0 ]; then
  echo "test suite failed"
  echo "$test_exit_code" > FAILED
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
