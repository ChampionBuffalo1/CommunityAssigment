import { RESULT_PER_PAGE } from '../Constants';

type PaginatedResponse = {
  currentPage: number;
  totalPages: number;
  skip: number;
  take: number;
};

export function getPaginatedParameters(
  query: number,
  totalRecords: number,
  resultPerPage = RESULT_PER_PAGE,
): PaginatedResponse {
  const totalPages = Math.ceil(totalRecords / resultPerPage);
  const currentPage = Math.min(Math.max(Number(query), 1), totalPages);
  const skip = (currentPage - 1) * resultPerPage;
  const take = resultPerPage;
  return {
    skip,
    take,
    totalPages,
    currentPage,
  };
}
