/** Data contracts for company team membership and company-search results. */
// types/team.ts

/** Represents a user's company membership, its approval lifecycle, employment details, and related user/company records. */
export interface TeamMember {
    id: number;
    companyId: number;
    userId: number;
    designation: string;
    department?: string;
    employmentType?: string;
    startDate?: string;
    endDate?: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'FORMER';
    approvedById?: number;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        avatarUrl?: string;
        headline?: string;
        location?: string;
    };
    company: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string;
        tagline?: string;
        isVerified?: boolean;
    };
    approvedBy?: {
        id: number;
        fullName: string;
    };
}

/** Company data returned by team-management search, with optional industry and branding details. */
export interface CompanySearchResult {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
    tagline?: string;
    industry?: {
        id: number;
        name: string;
    };
}