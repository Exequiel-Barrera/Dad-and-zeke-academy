import rexImage from '../../assets/images/Rex.png'

type RexProps = {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

function Rex({ message, size = 'medium' }: RexProps) {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-40',
    large: 'w-64',
  }

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={rexImage}
        alt="Rex, the Dad and Zeke Academy dinosaur explorer"
        className={`${sizeClasses[size]} rounded-3xl object-cover shadow-lg`}
      />

      {message && (
        <div className="mt-4 max-w-md rounded-2xl bg-white p-4 text-xl font-semibold shadow">
          {message}
        </div>
      )}
    </div>
  )
}

export default Rex