import { Link } from '@tanstack/react-router'

type PostSummary = {
  slug: string
  title: string
  description: string
  pubDate: Date
  readingTime: number
  tags: string[]
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return <p className="text-zinc-500">Aucun article pour l'instant.</p>

  return (
    <ul className="space-y-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to="/posts/$slug" params={{ slug: post.slug }} className="group block">
            <h2 className="text-xl font-semibold group-hover:underline">{post.title}</h2>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{post.description}</p>
          </Link>
          <p className="mt-2 flex flex-wrap gap-x-3 text-sm text-zinc-500">
            <time dateTime={new Date(post.pubDate).toISOString()}>
              {dateFormat.format(new Date(post.pubDate))}
            </time>
            <span>{post.readingTime} min</span>
            {post.tags.map((tag) => (
              <Link key={tag} to="/tags/$tag" params={{ tag }} className="hover:underline">
                #{tag}
              </Link>
            ))}
          </p>
        </li>
      ))}
    </ul>
  )
}
