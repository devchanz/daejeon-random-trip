'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RouteResult } from '../../lib/random/types';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { GUESTBOOK_AVATARS, DEFAULT_AVATAR_ID } from '../../config/product';
import { CharacterSelector } from './CharacterSelector';
import { OVERLAY_BACKDROP, OVERLAY_DIALOG, OVERLAY_STATIC_ZONE, useScrollLock } from '../common';

export interface GuestbookComposerProps {
  routeResult: RouteResult;
  isOpen: boolean;
  /**
   * Whether *this specific submission* can still unlock the reroll reward --
   * derived by the caller from reroll session state (`rerollReward === 'locked'`),
   * never recomputed here. The composer has no reward-state machine of its own;
   * it only renders copy that matches what will actually happen on success.
   */
  rewardEligible: boolean;
  onClose: () => void;
  onSuccess: (record: GuestbookEntryRecord) => void;
}

export function GuestbookComposer({
  routeResult,
  isOpen,
  rewardEligible,
  onClose,
  onSuccess,
}: GuestbookComposerProps) {
  const router = useRouter();
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(DEFAULT_AVATAR_ID);
  const [nickname, setNickname] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  // Snapshot of whether *this* submission actually granted the reward -- captured
  // once, at submit time, from the `rewardEligible` prop as it stood *before*
  // onSuccess() runs. The live `rewardEligible` prop cannot be read directly in
  // the success view: onSuccess() synchronously calls unlockRerollReward in the
  // parent, and React batches that state update together with this component's
  // own setIsSuccess(true), so by the time the success screen renders, the prop
  // has already flipped to reflect the post-submission (now non-'locked') state.
  const [rewardGrantedThisSubmission, setRewardGrantedThisSubmission] =
    useState<boolean>(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending close timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Lock document scroll while the composer is open (shared refcounted lock --
  // see useScrollLock.ts). Previously this composer had NO scroll lock of its
  // own at all -- it silently relied on ResultArea's, since it only ever opened
  // from within a revealed Result Card. Adopting the shared lock directly makes
  // that an explicit, self-contained contract rather than an implicit one.
  useScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    onClose();
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    if (errorMessage) setErrorMessage(null);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    const trimmedMessage = message.trim();

    // Client-side validation
    if (!selectedAvatarId) {
      setErrorMessage('캐릭터 아바타를 선택해 주세요.');
      return;
    }

    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      setErrorMessage('닉네임은 2자 이상 12자 이하로 입력해 주세요.');
      return;
    }

    if (trimmedMessage.length < 1 || trimmedMessage.length > 50) {
      setErrorMessage('소감 메시지는 1자 이상 50자 이하로 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarId: selectedAvatarId,
          nickname: trimmedNickname,
          message: trimmedMessage,
          routeId: routeResult.id,
          zoneId: routeResult.zoneId,
          durationType: routeResult.durationType,
          preferenceType: routeResult.preference,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorText = data?.error ?? '방명록 저장에 실패했습니다. 다시 시도해 주세요.';
        setErrorMessage(errorText);
        setIsSubmitting(false);
        return;
      }

      // Successful persistent DB save verified
      const record = data.data as GuestbookEntryRecord;

      // 0. Snapshot the outcome BEFORE onSuccess() can change rewardEligible upstream.
      const rewardGranted = rewardEligible;

      // 1. Immediately notify parent to unlock reroll reward (no delay on reward unlock)
      onSuccess(record);

      // 2. Refresh Server Component data on the current route (e.g. the Right Rail's
      //    live Random Log preview) so the new entry appears without a manual reload.
      //    Preserves unaffected client state (Result/reveal/minimize) and performs no navigation.
      router.refresh();

      // 3. Present success feedback to the user, using the snapshot above
      setRewardGrantedThisSubmission(rewardGranted);
      setIsSuccess(true);
      setIsSubmitting(false);

      // 4. Short presentation delay solely for closing the modal
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-composer-title"
      className={`${OVERLAY_BACKDROP} bg-[#2b2520]/50 backdrop-blur-xs animate-reveal-fade-in`}
    >
      <div
        className={`${OVERLAY_DIALOG} w-full max-w-lg rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-5 sm:p-7 text-[#2b2520] shadow-retro-xl animate-ticket-entrance`}
      >
        {/* Top Perforation Deco */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
        />

        {/* Header: always reachable and non-scrolling */}
        <div
          className={`flex items-start justify-between border-b-2 border-[#2b2520] pb-3 mb-4 ${OVERLAY_STATIC_ZONE}`}
        >
          <div>
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1 mb-0.5">
              <span>📓</span>
              <span>VISITOR LOG COMPOSER</span>
            </span>
            <h2
              id="guestbook-composer-title"
              className="text-lg sm:text-xl font-black text-[#2b2520]"
            >
              {rewardEligible ? '랜덤 로그 남기고 1회 더 뽑기' : '랜덤 로그 남기기'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2b2520] bg-[#faf6ee] text-sm font-black text-[#2b2520] shadow-retro-xs hover:bg-[#f0eae0] cursor-pointer"
          >
            &times;
          </button>
        </div>

        {isSuccess ? (
          rewardGrantedThisSubmission ? (
            /* CASE A: this submission actually unlocked the reroll reward. */
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto overscroll-none py-8 text-center animate-ticket-entrance">
              <span className="text-4xl" role="img" aria-label="Party Popper">
                🎉
              </span>
              <h3 className="text-lg font-black text-[#10b981]">
                랜덤 로그가 등록되었습니다!
              </h3>
              <p className="text-xs font-bold text-[#6b6257]">
                🎁 1회 더 뽑기 기회가 잠금 해제되었습니다!
              </p>
            </div>
          ) : (
            /* CASE B: reward already consumed this session -- quiet gratitude,
               no reroll/reward wording, no confetti-style icon. */
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto overscroll-none py-8 text-center animate-ticket-entrance">
              <span className="text-4xl" role="img" aria-label="Check Mark">
                ✅
              </span>
              <h3 className="text-lg font-black text-[#2b2520]">
                랜덤 로그를 남겨주셔서 고마워요.
              </h3>
              <p className="text-xs font-bold text-[#6b6257]">
                당신의 한 줄이 다음 여행자에게 대전 힌트가 될 거예요.
              </p>
            </div>
          )
        ) : (
          /* Form Content -- three-zone shell (header above is its own shrink-0
             zone): the <form> itself becomes the flex column, with an inner
             scroll zone for the fields and the 취소/등록하기 row lifted out as a
             shrink-0 sibling INSIDE the same <form> (not outside it), so the
             submit button stays natively associated with this form and every
             validation/submit code path below is untouched. */
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-none">
              {/* Auto-attached Route Info Tag */}
              <div className="rounded-xl border border-[#e4dcce] bg-[#faf6ee] p-3 text-xs">
                <div className="font-mono text-[10px] font-black text-[#8c8273] uppercase mb-1">
                  ATTACHED ROUTE
                </div>
                <div className="font-bold text-[#2b2520] flex flex-wrap items-center gap-1.5">
                  <span>{routeResult.title}</span>
                  <span className="rounded-md border border-[#d8d0c2] bg-white px-1.5 py-0.2 text-[10px] font-bold text-[#7d7364]">
                    {routeResult.stops?.length ?? 0}곳 코스
                  </span>
                </div>
              </div>

              {/* 1. Avatar Selection */}
              <CharacterSelector
                avatars={GUESTBOOK_AVATARS}
                selectedId={selectedAvatarId}
                onSelect={handleAvatarSelect}
              />

              {/* 2. Nickname Input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="guestbook-nickname"
                    className="text-xs font-black text-[#2b2520]"
                  >
                    닉네임 (2~12자) <span className="text-[#ff5555]">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-[#8c8273]">
                    {nickname.length}/12
                  </span>
                </div>
                <input
                  id="guestbook-nickname"
                  type="text"
                  maxLength={12}
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="여행자 닉네임을 입력하세요"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] px-3 py-2 text-sm font-bold text-[#2b2520] placeholder-[#a89f91] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#ff5555]"
                />
              </div>

              {/* 3. Message Input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="guestbook-message"
                    className="text-xs font-black text-[#2b2520]"
                  >
                    한 줄 로그 메시지 (1~50자) <span className="text-[#ff5555]">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-[#8c8273]">
                    {message.length}/50
                  </span>
                </div>
                <input
                  id="guestbook-message"
                  type="text"
                  maxLength={50}
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="코스 소감이나 기대되는 점을 남겨보세요!"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] px-3 py-2 text-sm font-bold text-[#2b2520] placeholder-[#a89f91] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#ff5555]"
                />
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border-2 border-[#ff5555] bg-[#fef2f2] p-2.5 text-xs font-black text-[#991b1b]"
                >
                  ⚠️ {errorMessage}
                </div>
              )}
            </div>

            {/* Actions: always reachable and non-scrolling, but still inside
                the <form> so the submit button keeps native form association. */}
            <div
              className={`flex gap-2 pt-2 border-t border-[#e4dcce] ${OVERLAY_STATIC_ZONE}`}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 text-xs font-bold text-[#7d7364] hover:bg-[#f0eae0] cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-2 rounded-xl border-2 border-[#2b2520] py-2.5 px-4 text-xs font-black text-white transition-all ${
                  isSubmitting
                    ? 'bg-[#ffa8a8] text-[#782424] cursor-wait'
                    : 'bg-[#ff5555] hover:bg-[#ff3b3b] shadow-retro-xs cursor-pointer active:translate-x-[1px] active:translate-y-[1px]'
                }`}
              >
                {isSubmitting
                  ? '저장 중...'
                  : rewardEligible
                    ? '등록하고 1회 더 뽑기 받기'
                    : '등록하기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
