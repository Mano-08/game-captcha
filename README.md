# Castle Quest: Gamified CAPTCHA Challenge

A fun and interactive CAPTCHA alternative that verifies users by having them guide a knight through a challenging maze to reach the castle.

![Screenshot of the Game](https://github.com/user-attachments/assets/1977c9ce-dfa3-416d-b2ee-18b05eb218eb)

## Key Features

- Mouse-Driven Gameplay: Ensure all interactions mimic typical CAPTCHA behaviour with mouse-based controls.
- AI-Resistant Challenges: Introduce dynamic and interactive CAPTCHA tasks to outsmart AI models trained to exploit static CAPTCHAs.
- Integration with GotCHA: <a href="https://github.com/tcerqueira/gotcha-widget-lib">GotCHA widget library</a> is used for CAPTCHA verification.
- Retro-Themed Gameplay: A pixelated game theme is adopted.
- Timed challenges: The player battles against the clock to complete the challenge.

## How to Play

- The user must navigate the knight to the castle
- The knight can move only to adjacent cells i.e. RIGHT, LEFT, TOP, BOTTOM
- Click on the knight's adjacent cell to move the knight.
- There are disappearing tiles in the game, they blink for 1 second before disappearing.
- Disappeared tiles come back to normal after 4 seconds.
- If the knight falls into the lava, the game is over.
- Complete the challenge within 30 seconds.

## GotCHA Integration

The following callbacks are utilized for CAPTCHA verification:

```typescript
const handleGameCaptcha = async (gameStatus: string) => {
  if (gameStatus === "lost") {
    await onChallengeResponse(false); // failed challenge
  } else if (gameStatus === "won") {
    await onChallengeResponse(true); // successful challenge
  } else if (gameStatus === "expired") {
    await onChallengeExpired(); // challenge expired
  }
};
```
