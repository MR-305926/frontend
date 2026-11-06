@ECHO OFF
CLS
ECHO FIXING_STUFF
npm audit fix > NUL
REM our litle secret ;)
ECHO NO_CONSEQUENTIAL_PROBLEM_DETECTED
ECHO CHECKING_CODE_QUALITY
npm run lint
npm audit --omit=dev
