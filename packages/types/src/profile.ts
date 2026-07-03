import type { Metadata } from "./common";

/**
 * Investor segment definitions.
 */
export type InvestorType = "individual" | "institutional" | "advisor" | "enterprise";

/**
 * KYC status categories for investor onboarding.
 */
export type KycStatus = "pending" | "verified" | "restricted" | "failed";

/**
 * Organization lifecycle state in the investor domain.
 */
export type OrganizationStatus = "active" | "inactive" | "archived";

/**
 * Primary investor entity representing the operating client.
 */
export interface Investor {
  readonly id: string;
  readonly profileId: string;
  readonly organizationId?: string;
  readonly investorType: InvestorType;
  readonly status: "active" | "inactive" | "archived";
  readonly primaryContactId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}

/**
 * Investor profile containing identifying and regulatory details.
 */
export interface Profile {
  readonly id: string;
  readonly investorId: string;
  readonly legalName: string;
  readonly displayName: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly address?: string;
  readonly city?: string;
  readonly country?: string;
  readonly kycStatus: KycStatus;
  readonly riskProfile?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}

/**
 * Organization record for corporate investor entities.
 */
export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly legalEntityIdentifier?: string;
  readonly sector?: string;
  readonly headquartersCountry?: string;
  readonly jurisdiction?: string;
  readonly status: OrganizationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}
