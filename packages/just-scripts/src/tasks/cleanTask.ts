import fse from 'fs-extra';
import parallelLimit from 'run-parallel-limit';
import path from 'path';
import { logger, TaskFunction } from 'just-task';

export function defaultCleanPaths(): string[] {
  return ['lib', 'temp', 'dist', 'coverage'];
}

export function cleanTask(paths: string[] = [], limit: number = 5): TaskFunction {
  if (paths.length === 0) {
    paths = defaultCleanPaths();
  }

  return function clean(done: (err?: Error) => void) {
    logger.info(`Removing [${paths.map(p => path.relative(process.cwd(), p)).join(', ')}]`);

    const cleanTasks = paths.map(
      cleanPath =>
        function(cb: (error: Error) => void) {
          fse.remove(cleanPath, cb);
        }
    );

    parallelLimit(cleanTasks, limit, done);
  };
}
