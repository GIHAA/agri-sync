import { useEffect } from 'react'
import { GetTopServiceProviders } from '../../api/dashboard/dashboard'
import StarRating from './star-rating'
import Button from '../common/button'
import { formatRating } from '../../hooks/formatter'
import { ProfileImage } from '../../utils/userData'
import NoDataFound from '../../assets/images/NoDataFound.png'

function TopServiceProviders() {
  const { data: topServiceProviders, isLoading } = GetTopServiceProviders()

  useEffect(() => {
    console.log('Service Providers', topServiceProviders)
  }, [topServiceProviders])

  return (
    <div>
      <div className="col-span-12 mt-6">
        <div className="intro-y block h-10 items-center sm:flex">
          <h2 className="mb-[5px] mr-5 text-[19px] text-lg font-medium text-[#2D3748]">
            Top Service Providers
          </h2>
        </div>
        <div className="h-[400px] w-full">
          {topServiceProviders && topServiceProviders.length > 0 ? (
            Array.from({ length: 5 }).map((_, index) => {
              const provider = topServiceProviders[index]
              return (
                <div
                  key={index}
                  className="mt-[10px] flex h-[95px] w-full items-center justify-between rounded-xl bg-white px-4 shadow-md"
                >
                  {provider ? (
                    <div className="flex items-center">
                      <img
                        src={provider.profilePictureUrl || ProfileImage}
                        alt={`${provider.firstName} ${provider.lastName}`}
                        className="mr-3 h-[55px] w-[55px] rounded-full object-cover"
                      />
                      <div>
                        <p className="text-base font-semibold capitalize">{`${provider.firstName} ${provider.lastName}`}</p>
                        <p className="text-sm text-gray-500">
                          {formatRating(provider.averageRating)}/5
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center"></div>
                  )}
                  {provider && (
                    <div className="flex items-center">
                      <StarRating rating={provider.averageRating} />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="mt-[10px] flex w-full flex-col items-center justify-center rounded-xl bg-white px-4 shadow-md">
              <img
                src={NoDataFound}
                alt="No data found"
                className="max-h-[500px] min-h-[500px] w-fit object-cover"
              />
              <span className="mb-12 text-center">No Data Found...</span>
            </div>
          )}

          {topServiceProviders && topServiceProviders.length > 0 && (
            <Button className="mt-[15px] w-full bg-black">
              <span className="text-white">View all</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopServiceProviders
