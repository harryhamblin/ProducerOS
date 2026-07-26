import { getProjects } from "./getProjects";
import { getProjectSummary } from "./getProjectSummary";

export async function getProjectSummaries() {

    const projects = await getProjects();

    return Promise.all(

        projects.map(async project => ({

            project,

            summary: await getProjectSummary(project.id),

        }))

    );

}