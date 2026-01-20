'use client';

import React, { useMemo } from 'react';
import { useDraftStore } from '@/stores/useDraftStore';
import { DraftStatus, DraftType } from '@/common/constants/farcaster';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDaysIcon, TrashIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useNavigationStore, CastModalView } from '@/stores/useNavigationStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SchedulerDashboard() {
    const { drafts, removePostDraftById, addNewPostDraft } = useDraftStore();
    const { openNewCastModal, setCastModalDraftId, setCastModalView } = useNavigationStore();

    const scheduledCasts = useMemo(() => {
        return drafts
            .filter((d) => d.status === DraftStatus.scheduled)
            .sort((a, b) => {
                const dateA = a.scheduledFor ? new Date(a.scheduledFor).getTime() : 0;
                const dateB = b.scheduledFor ? new Date(b.scheduledFor).getTime() : 0;
                return dateA - dateB;
            });
    }, [drafts]);

    const handleEdit = (draft: DraftType) => {
        setCastModalView(CastModalView.New);
        setCastModalDraftId(draft.id);
        openNewCastModal();
    };

    const handleDelete = async (draftId: string) => {
        try {
            await removePostDraftById(draftId);
            toast.success('Scheduled cast removed');
        } catch (error) {
            toast.error('Failed to remove cast');
        }
    };

    const handleCreateNew = () => {
        addNewPostDraft({
            onSuccess(draftId) {
                setCastModalView(CastModalView.New);
                setCastModalDraftId(draftId);
                openNewCastModal();
            },
        });
    };

    return (
        <div className="p-6 h-full overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cast Scheduler</h1>
                    <p className="text-muted-foreground">Manage your upcoming Farcaster posts.</p>
                </div>
                <Button onClick={handleCreateNew} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Schedule New Cast
                </Button>
            </div>

            <div className="grid gap-6">
                {scheduledCasts.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-xl">No scheduled casts</CardTitle>
                            <CardDescription className="mt-2 max-w-sm">
                                You haven't scheduled any casts yet. Click the button above to start planning your content.
                            </CardDescription>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {scheduledCasts.map((cast) => (
                            <Card key={cast.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                                <div className="flex flex-col md:flex-row">
                                    <div className="bg-muted/30 p-4 md:w-48 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-muted">
                                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                                            {cast.scheduledFor ? format(new Date(cast.scheduledFor), 'MMM d') : 'Pending'}
                                        </span>
                                        <span className="text-2xl font-bold">
                                            {cast.scheduledFor ? format(new Date(cast.scheduledFor), 'HH:mm') : '--:--'}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {cast.scheduledFor ? format(new Date(cast.scheduledFor), 'yyyy') : ''}
                                        </span>
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                                        <div className="space-y-2">
                                            <p className="text-sm line-clamp-3 whitespace-pre-wrap break-words">
                                                {cast.text || <span className="italic text-muted-foreground">Empty cast</span>}
                                            </p>
                                            {cast.embeds && cast.embeds.length > 0 && (
                                                <div className="flex gap-2">
                                                    {cast.embeds.map((e, i) => (
                                                        <div key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded truncate max-w-[150px]">
                                                            {e.url}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cast)} className="gap-1">
                                                <PencilSquareIcon className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cast.id)} className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <TrashIcon className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
