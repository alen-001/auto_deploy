import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

import { Worker } from 'bullmq';
import { db, deployments } from "@auto_deploy/types";
import { eq } from "drizzle-orm";

const worker = new Worker(
    'deploy',
    async job => {
    const {repo_url, branch, build_command, callback_url,deployId,out_dir} = job.data;
    console.log(`Processing deploy job: repo_url=${repo_url}, branch=${branch}, callback_url=${callback_url}`);
    
    // Update status to building
    await db.update(deployments).set({ status: 'building' }).where(eq(deployments.id, deployId));

    try {
        // Simulate deployment process
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        await db.update(deployments).set({ status: 'success' }).where(eq(deployments.id, deployId));
        
        if (callback_url) {
            console.log("Sending request to callback URL:", callback_url,{"deploy_status": "success", repo_url, branch, deployId});
        }
    }catch(err:any){
        await db.update(deployments).set({ status: 'failed', logs: err.message }).where(eq(deployments.id, deployId));
        console.error(`Error processing job for ${deployId}: ${err.message}`);
    }
    console.log(`Completed deploy job: repo_url=${repo_url}, branch=${branch}`);
    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);