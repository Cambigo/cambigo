import { clerkSetup } from '@clerk/testing/playwright';
import 'dotenv/config';


async function globalSetup() {
  await clerkSetup();
}

export default globalSetup;