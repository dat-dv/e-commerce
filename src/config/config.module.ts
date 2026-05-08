import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config.validation';

const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  expandVariables: true,
  envFilePath: '.env',
  validationSchema: envValidationSchema,
});

export default AppConfigModule;
