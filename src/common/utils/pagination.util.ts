export class Pagination {
  static getPaginationParams(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  static getPaginationMeta(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
