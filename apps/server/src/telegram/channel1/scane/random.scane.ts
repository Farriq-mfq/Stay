// import { Scene, SceneEnter, SceneLeave, Command } from 'nestjs-telegraf';
// import { Context } from 'src/interfaces/context.interface';
// import { HELLO_SCENE_ID } from '../app-channel1.contants';

// @Scene(HELLO_SCENE_ID)
// export class RandomNumberScene {
//     @SceneEnter()
//     onSceneEnter(): string {
//         console.log('Enter to scene');
//         return 'Welcome on scene ✋';
//     }

//     @SceneLeave()
//     onSceneLeave(): string {
//         console.log('Leave from scene');
//         return 'Bye Bye 👋';
//     }

//     @Command(['rng', 'random'])
//     onRandomCommand(): number {
//         console.log('Use "random" command');
//         return Math.floor(Math.random() * 11);
//     }

//     @Command('leave')
//     async onLeaveCommand(ctx: Context): Promise<void> {
//         await ctx.scene.leave();
//     }
// }
