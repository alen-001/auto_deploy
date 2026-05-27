import { Worker } from 'bullmq';
const worker = new Worker(
    'deploy',
    async job => {
    const {repo_url, branch, build_command, commit_sha, callback_url,deployId} = job.data;
    console.log(`Processing deploy job: repo_url=${repo_url}, branch=${branch}, commit_sha=${commit_sha}, callback_url=${callback_url}`);
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 1000));
    try{
        // const res=await fetch(callback_url, {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({status: 'success', repo_url, branch, commit_sha})
        // });
        // if(!res.ok){
        //     console.error(`Failed to send callback to ${callback_url}: ${res.statusText}`);
        // }
        console.log("Sending request to callback URL:", callback_url,{"deploy_status": "success", repo_url, branch, commit_sha, deployId});
    }catch(err:any){
        console.error(`Error sending callback to ${callback_url}: ${err.message}`);
    }
    console.log(`Completed deploy job: repo_url=${repo_url}, branch=${branch}, commit_sha=${commit_sha}`);
    // Here you can add code to send a callback to the callback_url if needed
    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);