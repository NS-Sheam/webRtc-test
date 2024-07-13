type TPagenationOptions ={
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

type TPaginationResult = {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    skip: number;

}

const calculatePagination = (options: TPagenationOptions) => {
    const page= options?.page || 1;
    const limit = options?.limit || 10;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        sortBy,
        sortOrder,
        skip
    }
}

export const paginationHelper = {
    calculatePagination
}