// Shared-element page transitions: the same view-transition-name on a list's title and on the
// page's <h1> makes the browser morph one into the other during navigation. A name must be unique
// on a page, or the browser skips the whole transition: only one element per slug may carry it.
// Both ends must hug their text (w-fit / inline-block): the snapshot is scaled from one box to the
// other, so a full-width <h1> facing a text-wide link would stretch the title sideways.

type TitleKind = 'post' | 'reading'

export const titleTransition = (kind: TitleKind, slug: string) => ({
  viewTransitionName: `${kind}-title-${slug}`,
})
