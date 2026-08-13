// components/recruiter/TeamManagementTab.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users, RefreshCw, Mail, Building2,
    AlertTriangle, UserPlus, Search, Pencil, UserX, Edit2, Trash2,
    Loader2, UserCheck,
    CheckCircle
} from 'lucide-react';
import SearchCandidates from './SearchCandidates';

type TeamMember = {
    id: number;
    userId: number;
    designation: string;
    department?: string;
    employmentType?: string;
    startDate?: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'FORMER';
    rejectionReason?: string;
    createdAt: string;
    endDate?: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        avatarUrl?: string;
        headline?: string;
        username?: string;
    };
    company: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string;
    };
};

type TeamEligibility = {
    canAdd: boolean;
    plan?: string;
    planLabel?: string;
    activeMembers: number;
    effectiveLimit: number | 'Unlimited';
    remaining: number | null;
    isUnlimited: boolean;
    upgradeRequired?: boolean;
    message?: string;
} | null;

interface Candidate {
    id: number;
    fullName: string;
    email: string;
    username: string;
    avatarUrl?: string;
    headline?: string;
}

export default function TeamManagementTab() {
    const [activeTab, setActiveTab] = useState<'members' | 'add'>('members');
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [teamEligibility, setTeamEligibility] = useState<TeamEligibility>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Add tab states
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [addingMember, setAddingMember] = useState(false);
    const [addedMemberName, setAddedMemberName] = useState<string | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [editForm, setEditForm] = useState({
        designation: '',
        department: '',
        employmentType: '',
    });
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    function getStoredCompanyId() {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return null;

            const user = JSON.parse(storedUser);
            const companyId = Number(user?.companyId);

            return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
        } catch {
            return null;
        }
    }

    function buildTeamUrl(path: string, companyId: number | null) {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${path}`);

        if (companyId) {
            url.searchParams.set('companyId', String(companyId));
        }

        return url.toString();
    }

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const token = localStorage.getItem('token');
            const companyId = getStoredCompanyId();
            console.log('🔍 Fetching team data...');

            // Fetch team members
            const membersRes = await fetch(buildTeamUrl('/api/team/members', companyId), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!membersRes.ok) {
                throw new Error(`Failed to fetch members: ${membersRes.status}`);
            }

            const membersData = await membersRes.json();
            let members = [];
            if (Array.isArray(membersData)) {
                members = membersData;
            } else if (membersData?.data && Array.isArray(membersData.data)) {
                members = membersData.data;
            } else if (membersData?.members && Array.isArray(membersData.members)) {
                members = membersData.members;
            }
            setMembers(members);
            setTeamEligibility(membersData?.eligibility ?? null);

        } catch (err: any) {
            console.error('❌ Error loading team data:', err);
            setError(err.message || 'Failed to load data');
            setMembers([]);
            setTeamEligibility(null);
        } finally {
            setLoading(false);
        }
    }

    const handleSelectCandidate = async (candidate: Candidate) => {
        if (!candidate) return;

        try {
            setAddingMember(true);
            setError(null);

            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: candidate.id,
                    designation: 'Team Member', // Default designation
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to add team member');
            }

            const data = await res.json();
            console.log('✅ Team member added:', data);

            // Store the name for success message
            const memberName = data.data?.user?.fullName || candidate.fullName || 'Team member';
            setAddedMemberName(memberName);

            // Close search modal and refresh data
            setShowSearchModal(false);
            await loadData();

            // Show success message with the member's name
            setSuccessMessage(`✅ ${memberName} has been added to your team successfully!`);
            setTimeout(() => setSuccessMessage(null), 5000);

            // Switch to members tab
            setActiveTab('members');
        } catch (err: any) {
            console.error('❌ Error adding team member:', err);
            alert(err.message || 'Failed to add team member');
        } finally {
            setAddingMember(false);
        }
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member);
        setEditForm({
            designation: member.designation || '',
            department: member.department || '',
            employmentType: member.employmentType || '',
        });
    };

    const handleUpdateMember = async () => {
        if (!editingMember) return;

        try {
            setProcessingId(editingMember.id);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${editingMember.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to update member');
            }

            const data = await res.json();
            setSuccessMessage(`✅ ${data.data.user.fullName}'s details have been updated!`);
            setEditingMember(null);
            await loadData();
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            alert(err.message || 'Failed to update member');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRemoveMember = async () => {
        if (!selectedMemberId) return;

        try {
            setProcessingId(selectedMemberId);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${selectedMemberId}/remove`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to remove member');
            }

            const data = await res.json();
            setSuccessMessage(`✅ ${data.data.user.fullName} has been removed from the team.`);
            setShowRemoveModal(false);
            setSelectedMemberId(null);
            await loadData();
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            alert(err.message || 'Failed to remove member');
        } finally {
            setProcessingId(null);
        }
    };

    // True when the current plan doesn't include Team Management at all
    // (backend sends effectiveLimit = 0 for plans without the feature, e.g. Free)
    const noTeamAccess =
        teamEligibility !== null &&
        !teamEligibility.isUnlimited &&
        Number(teamEligibility.effectiveLimit) === 0;

    // True when the plan supports team members but the active count has hit the cap
    const limitReached =
        teamEligibility !== null &&
        !teamEligibility.isUnlimited &&
        !noTeamAccess &&
        (
            teamEligibility.remaining !== null
                ? teamEligibility.remaining <= 0
                : teamEligibility.activeMembers >= Number(teamEligibility.effectiveLimit)
        );

    const teamCountLabel = !teamEligibility
        ? null
        : teamEligibility.isUnlimited
            ? 'Unlimited'
            : noTeamAccess
                ? 'Not available'
                : `${teamEligibility.activeMembers} / ${teamEligibility.effectiveLimit}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B5ED]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-[#CCCCCC]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#FFFFFF]">Team Management</h2>
                    <p className="text-sm text-[#CCCCCC] mt-1">Manage your team members</p>
                </div>
                <div className="flex items-center gap-4">
                    {teamCountLabel && (
                        <div className="text-right">
                            <p className="text-xs text-[#B8B8B8]">Current Team Members</p>
                            <p className="text-sm font-semibold text-[#FFFFFF]">{teamCountLabel}</p>
                        </div>
                    )}
                    <button
                        onClick={loadData}
                        className="p-2 text-[#B8B8B8] hover:text-[#FFFFFF] hover:bg-[#171A1E] rounded-xl transition flex items-center gap-2"
                    >
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl">
                    ❌ {error}
                </div>
            )}

            {/* Plan doesn't include Team Management at all */}
            {noTeamAccess && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="flex-shrink-0" />
                        <span className="text-sm font-medium">
                            {`Team Management isn't included in your ${teamEligibility?.planLabel || 'current'} plan. Upgrade your subscription to add team members.`}
                        </span>
                    </div>
                    <a
                        href="/packages"
                        className="text-sm font-semibold text-[#00B5ED] underline whitespace-nowrap"
                    >
                        Upgrade Plan
                    </a>
                </div>
            )}

            {/* Plan supports team members but the cap has been hit */}
            {!noTeamAccess && limitReached && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="flex-shrink-0" />
                        <span className="text-sm font-medium">
                            {`You've reached your team member limit (${teamEligibility?.activeMembers}/${teamEligibility?.effectiveLimit}) for the ${teamEligibility?.planLabel || 'current'} plan. Upgrade your subscription to add more members.`}
                        </span>
                    </div>
                    <a
                        href="/packages"
                        className="text-sm font-semibold text-[#00B5ED] underline whitespace-nowrap"
                    >
                        Upgrade Plan
                    </a>
                </div>
            )}

            <div className="border-b border-[#292C30]">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-4 px-1 border-b-2 transition flex items-center gap-2 ${activeTab === 'members'
                            ? 'border-[#0073FF] text-[#0073FF] font-semibold'
                            : 'border-transparent text-[#B8B8B8] hover:text-[#FFFFFF]'
                            }`}
                    >
                        <Users size={18} />
                        Team Members
                        {members.length > 0 && (
                            <span className="bg-[#171A1E] text-[#FFFFFF] text-xs px-2 py-0.5 rounded-full border border-[#292C30]">
                                {members.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`pb-4 px-1 border-b-2 transition flex items-center gap-2 ${activeTab === 'add'
                            ? 'border-[#0073FF] text-[#0073FF] font-semibold'
                            : 'border-transparent text-[#B8B8B8] hover:text-[#FFFFFF]'
                            }`}
                    >
                        <UserPlus size={18} />
                        Add Team Member
                    </button>
                </nav>
            </div>

            <div className="space-y-4">
                {activeTab === 'members' && (
                    <>
                        {members.length === 0 ? (
                            <div className="text-center py-12 bg-[#171A1E] border border-[#292C30] rounded-xl">
                                <div className="text-4xl mb-3">👥</div>
                                <p className="text-[#CCCCCC]">No team members yet</p>
                                <p className="text-sm text-[#B8B8B8] mt-1">Add team members to get started</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {members.map((member) => (
                                    <div key={member.id} className="bg-[#171A1E] rounded-xl border border-[#292C30] p-4 hover:border-[#00B5ED]/40 transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-[#0073FF] flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {member.user.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-medium text-[#FFFFFF] truncate">{member.user.fullName}</h4>
                                                    <p className="text-sm text-[#CCCCCC] truncate">{member.designation}</p>
                                                    {member.department && (
                                                        <span className="text-xs text-[#B8B8B8]">{member.department}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleEditMember(member)}
                                                    className="p-2 text-[#00B5ED] hover:bg-[#1D2125] rounded-lg transition"
                                                    title="Edit member"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedMemberId(member.id);
                                                        setShowRemoveModal(true);
                                                    }}
                                                    className="p-2 text-rose-400 hover:bg-[#1D2125] rounded-lg transition"
                                                    title="Remove member"
                                                >
                                                    <UserX size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'add' && (
                    <div className="bg-[#171A1E] rounded-xl border border-[#292C30] p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-[#0073FF]/15 rounded-full flex items-center justify-center">
                                <UserPlus size={32} className="text-[#0073FF]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#FFFFFF]">Add Team Member</h3>
                                <p className="text-[#CCCCCC] mt-1">
                                    Search and add existing candidates to your team
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSearchModal(true)}
                                disabled={limitReached || noTeamAccess}
                                className="px-6 py-3 bg-[#0073FF] text-white rounded-xl hover:bg-[#0060D0] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                <Search size={18} />
                                Search Candidates
                            </button>

                            {noTeamAccess && (
                                <p className="text-sm text-amber-400 mt-2">
                                    ⚠️ Team Management isn't part of your current package.{' '}
                                    <a href="/packages" className="underline font-medium text-[#00B5ED]">
                                        Upgrade your plan
                                    </a>{' '}
                                    to unlock it.
                                </p>
                            )}
                            {!noTeamAccess && limitReached && (
                                <p className="text-sm text-amber-400 mt-2">
                                    ⚠️ Team limit reached.{' '}
                                    <a href="/packages" className="underline font-medium text-[#00B5ED]">
                                        Upgrade
                                    </a>{' '}
                                    to add more members.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Member Modal */}
            {editingMember && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1D2125] border border-[#292C30] rounded-xl max-w-md w-full p-6 text-[#CCCCCC]">
                        <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">
                            Edit Team Member
                        </h3>
                        <p className="text-sm text-[#B8B8B8] mb-4">
                            Editing {editingMember.user.fullName}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#CCCCCC] mb-1">
                                    Designation *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.designation}
                                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                    className="w-full bg-[#171A1E] border border-[#292C30] text-[#FFFFFF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#00B5ED] focus:outline-none"
                                    placeholder="e.g., Senior Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#CCCCCC] mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={editForm.department || ''}
                                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                    className="w-full bg-[#171A1E] border border-[#292C30] text-[#FFFFFF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#00B5ED] focus:outline-none"
                                    placeholder="e.g., Engineering"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#CCCCCC] mb-1">
                                    Employment Type
                                </label>
                                <select
                                    value={editForm.employmentType || ''}
                                    onChange={(e) => setEditForm({ ...editForm, employmentType: e.target.value })}
                                    className="w-full bg-[#171A1E] border border-[#292C30] text-[#FFFFFF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#00B5ED] focus:outline-none"
                                >
                                    <option value="">Select type</option>
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERN">Intern</option>
                                    <option value="FREELANCE">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateMember}
                                disabled={processingId !== null || !editForm.designation.trim()}
                                className="flex-1 bg-[#0073FF] text-white px-4 py-2.5 rounded-xl hover:bg-[#0060D0] transition disabled:opacity-50 font-medium"
                            >
                                {processingId ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setEditingMember(null)}
                                className="flex-1 border border-[#292C30] text-[#CCCCCC] px-4 py-2.5 rounded-xl hover:bg-[#171A1E] transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Member Modal */}
            {showRemoveModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1D2125] border border-[#292C30] rounded-xl max-w-md w-full p-6 text-[#CCCCCC]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-rose-500/15 rounded-full flex items-center justify-center">
                                <UserX size={24} className="text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-[#FFFFFF]">Remove Team Member</h3>
                        </div>
                        <p className="text-[#CCCCCC] mb-2">
                            Are you sure you want to remove this team member?
                        </p>
                        <p className="text-sm text-[#B8B8B8]">
                            They will be marked as FORMER and will no longer appear in your team list.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleRemoveMember}
                                disabled={processingId !== null}
                                className="flex-1 bg-rose-600 text-white px-4 py-2.5 rounded-xl hover:bg-rose-700 transition disabled:opacity-50 font-medium"
                            >
                                {processingId ? 'Removing...' : 'Confirm Removal'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRemoveModal(false);
                                    setSelectedMemberId(null);
                                }}
                                className="flex-1 border border-[#292C30] text-[#CCCCCC] px-4 py-2.5 rounded-xl hover:bg-[#171A1E] transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Candidates Modal */}
            {showSearchModal && (
                <SearchCandidates
                    onSelect={handleSelectCandidate}
                    onClose={() => setShowSearchModal(false)}
                    loading={addingMember}
                    addedUserId={null}
                />
            )}
        </div>
    );
}