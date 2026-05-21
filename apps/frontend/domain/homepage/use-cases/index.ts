import { appRequest } from "@/utils/request";
import { HomepageRepository } from "../infrastructure/homepage.repository";
import { GetHomepageSectionsUseCase } from "./get-homepage-sections.use-case";

const repo = new HomepageRepository(appRequest);

export const homepageUseCase = {
  getSections: new GetHomepageSectionsUseCase(repo),
};
