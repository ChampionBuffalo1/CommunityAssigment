import { RESULT_PER_PAGE } from '../Constants';

type PaginatedResponse = {
  currentPage: number;
  totalPages: number;
  skip: number;
  take: number;
};

export function getPaginatedParameters(
  query: string,
  totalRecords: number,
  resultPerPage = RESULT_PER_PAGE,
): PaginatedResponse {
  let queryNum = query ? parseInt(query, 10) : 0;
  if (Number.isNaN(queryNum) || !Number.isSafeInteger(queryNum)) {
    queryNum = 0;
  }
  const totalPages = Math.ceil(totalRecords / resultPerPage);
  const currentPage = Math.max(Math.min(queryNum, totalPages), 1);
  const skip = (currentPage - 1) * resultPerPage;
  const take = resultPerPage;
  return {
    skip,
    take,
    totalPages,
    currentPage,
  };
}
