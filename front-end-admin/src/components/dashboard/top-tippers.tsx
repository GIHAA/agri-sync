import { useEffect } from 'react'
import { GetTopTippersThisWeek } from '../../api/dashboard/dashboard'
import Button from '../common/button'
import { formatAmount } from '../../hooks/formatter'
import { ProfileImage } from '../../utils/userData'
import NoDataFound from '../../assets/images/NoDataFound.png'

function TopTippers() {
  const topTippers = GetTopTippersThisWeek()

  useEffect(() => {
    console.log('Tippers', topTippers)
  }, [topTippers])

  return (
    <div>
      <div className="col-span-12 mt-6">
        <div className="intro-y block h-10 items-center sm:flex">
          <h2 className="mb-[5px] mr-5 text-[19px] text-lg font-medium text-[#2D3748]">
            Top Tippers This Week
          </h2>
        </div>
        <div className="h-full w-full">
          {topTippers?.data && topTippers.data.length > 0 ? (
            Array.from({ length: 5 }).map((_, index) => {
              const tipper = topTippers.data[index] 
              return (
                <div
                  key={index}
                  className="mt-[10px] flex h-[95px] w-full items-center justify-between rounded-xl bg-white px-4 shadow-md"
                >
                  {tipper ? (
                    <div className="flex items-center">
                      <img
                        src={tipper.profilePictureUrl || ProfileImage}
                        alt={`${tipper.firstName} ${tipper.lastName}`}
                        className="mr-3 h-[55px] w-[55px] rounded-[30px] object-cover"
                      />
                      <div>
                        <p className="text-base font-semibold capitalize">{`${tipper.firstName} ${tipper.lastName}`}</p>
                        <p className="text-sm text-gray-500">
                          AED {formatAmount(tipper.totalTipAmount) || 0.0}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center"></div>
                  )}
                  {tipper && (
                    <div className="flex h-[29px] w-[78px] items-center justify-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      {`${tipper.tipCount || 0} Tips`}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="mt-[10px] flex w-full flex-col items-center  justify-center rounded-xl bg-white px-4  shadow-md">
              <img
                src={NoDataFound}
                alt="No data found"
                className="max-h-[500px] min-h-[500px] w-fit object-cover"
              />
              <span className="mb-12 text-center">No Data Found...</span>
            </div>
          )}

          {topTippers?.data && topTippers.data.length > 0 && (
            <Button className="mt-[15px] h-[40px] w-full bg-black">
              <span className="text-white">View all</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopTippers
