import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviews,
  postReview,
  updateReview,
  deleteReview,
} from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import type { Review } from "../../types/api";
import { REVIEWS_QUERY_KEY } from "./reviewUtils";
import { AutoScrollReviews } from "./AutoScrollReviews";
import { ConfirmDialog } from "../ui/ConfirmDialog";

const MAX_LENGTH = 500;

export default function ReviewsSection() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.user_id ?? null;

  const [newContent, setNewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: () => getReviews(50),
  });

  const postMutation = useMutation({
    mutationFn: (content: string) => postReview(content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_QUERY_KEY });
      const previous = queryClient.getQueryData<Review[]>(REVIEWS_QUERY_KEY);
      const optimistic: Review = {
        review_id: `temp-${Date.now()}`,
        user_id: currentUserId ?? "",
        username: user?.username ?? null,
        content,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData<Review[]>(REVIEWS_QUERY_KEY, (old = []) => [
        optimistic,
        ...old,
      ]);
      setNewContent("");
      return { previous };
    },
    onError: (_err, _content, context) => {
      if (context?.previous)
        queryClient.setQueryData(REVIEWS_QUERY_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      reviewId,
      content,
    }: {
      reviewId: string;
      content: string;
    }) => updateReview(reviewId, content),
    onMutate: async ({ reviewId, content }) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_QUERY_KEY });
      const previous = queryClient.getQueryData<Review[]>(REVIEWS_QUERY_KEY);
      queryClient.setQueryData<Review[]>(REVIEWS_QUERY_KEY, (old = []) =>
        old.map((r) => (r.review_id === reviewId ? { ...r, content } : r)),
      );
      setEditingReviewId(null);
      setEditingContent("");
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(REVIEWS_QUERY_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_QUERY_KEY });
      const previous = queryClient.getQueryData<Review[]>(REVIEWS_QUERY_KEY);
      queryClient.setQueryData<Review[]>(REVIEWS_QUERY_KEY, (old = []) =>
        old.filter((r) => r.review_id !== reviewId),
      );
      setEditingReviewId(null);
      setEditingContent("");
      return { previous };
    },
    onError: (_err, _reviewId, context) => {
      if (context?.previous)
        queryClient.setQueryData(REVIEWS_QUERY_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = newContent.trim();
    if (!trimmed) return;
    postMutation.mutate(trimmed);
  };

  const handleDelete = (r: Review) => setDeleteTarget(r);

  const confirmDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.review_id);
    setDeleteTarget(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newContent.trim())
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const inputRow = isAuthenticated ? (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-b border-border/40 px-3 py-2.5"
    >
      <div className="relative min-w-0 flex-1">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
          rows={1}
          placeholder="서비스 개선 요청사항이나 이용 후기를 남겨주세요."
          className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 pr-14 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          style={{ maxHeight: 80, overflowY: "auto" }}
          disabled={postMutation.isPending}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = `${Math.min(t.scrollHeight, 80)}px`;
          }}
        />
        <span className="pointer-events-none absolute right-2.5 bottom-1.5 text-[11px] tabular-nums text-muted-foreground/60">
          {newContent.length}/{MAX_LENGTH}
        </span>
      </div>
      <button
        type="submit"
        disabled={postMutation.isPending || !newContent.trim() || !user}
        className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {postMutation.isPending ? "..." : "등록"}
      </button>
    </form>
  ) : null;

  return (
    <section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="후기 삭제"
        description="이 후기를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80"
        style={{ height: isAuthenticated ? 280 : 260 }}
        aria-label="이용 후기"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            후기를 불러오는 중...
          </div>
        ) : reviews.length === 0 && !isAuthenticated ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            아직 이용 후기가 없습니다.
          </div>
        ) : (
          <div className="flex h-full flex-col">
            {inputRow}
            {postMutation.isError && (
              <p className="border-b border-border/40 px-3 py-1 text-xs text-red-600 dark:text-destructive">
                등록에 실패했습니다. 다시 시도해 주세요.
              </p>
            )}
            <div className="min-h-0 flex-1">
              {reviews.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  첫 후기를 남겨보세요!
                </div>
              ) : (
                <AutoScrollReviews
                  list={reviews}
                  currentUserId={currentUserId}
                  editingReviewId={editingReviewId}
                  editingContent={editingContent}
                  onEditingContentChange={setEditingContent}
                  onEdit={(r) => {
                    setEditingReviewId(r.review_id);
                    setEditingContent(r.content);
                  }}
                  onEditSave={() => {
                    if (editingReviewId && editingContent.trim())
                      updateMutation.mutate({
                        reviewId: editingReviewId,
                        content: editingContent.trim(),
                      });
                  }}
                  onEditCancel={() => {
                    setEditingReviewId(null);
                    setEditingContent("");
                  }}
                  onDelete={handleDelete}
                  isUpdating={updateMutation.isPending}
                  isDeleting={deleteMutation.isPending}
                  updateError={updateMutation.isError}
                  deleteError={deleteMutation.isError}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
