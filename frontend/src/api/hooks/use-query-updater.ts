import { InfiniteData, useQueryClient } from "@tanstack/react-query"
import { PageResult } from "@/src/api/types/page-result";
import addDataToTopOfInfiniteQueryData from "@/src/api/utils/add-data-to-top-of-infinite-query-data";
import updateInfiniteQueryDataById from "@/src/api/utils/update-infinite-query-data-by-id";
import removeDataFromInfiniteQueryDataById from "@/src/api/utils/remove-data-from-infinite-query-data-by-id";
import { mapInfiniteDataResult } from "@/src/api/utils/map-infinite-data-result";


type QueryUpdaterCommonProps<T> = {
  id: string;
  newData: T;
  queryKey: string[];
  updateFields: Partial<T>
}


const useQueryUpdater = <T extends { id: string }>() => {

  const queryClient = useQueryClient()

  function insertIntoInfiniteQuery({
    newData,
    queryKey
  }: Pick<QueryUpdaterCommonProps<T>, "newData" | "queryKey">) {

    queryClient.setQueryData<InfiniteData<PageResult<T>>>(
      queryKey,
      data => {
        if (!data) return
        const mappedData = mapInfiniteDataResult(data)
        if (mappedData.find(oldData => oldData.id === newData.id)) return
        const updatedData = addDataToTopOfInfiniteQueryData({
          data,
          dataToAdd: newData
        })
        return updatedData
      }
    )
  }

  function updateDataFromInfiniteQuery({
    id,
    queryKey,
    updateFields
  }: Omit<QueryUpdaterCommonProps<T>, 'newData'>) {

    queryClient.setQueryData<InfiniteData<PageResult<T>>>(
      queryKey,
      data => {
        if (!data) return

        const updatedData = updateInfiniteQueryDataById({
          data,
          updateFields,
          id
        })
        return updatedData
      }
    )
  }

  function removeDataFromInfiniteQuery({
    id,
    queryKey,
  }: Omit<QueryUpdaterCommonProps<T>, 'newData' | 'updateFields'>) {

    queryClient.setQueryData<InfiniteData<PageResult<T>>>(
      queryKey,
      data => {
        if (!data) return
        const updatedData = removeDataFromInfiniteQueryDataById({
          data,
          id
        })
        return updatedData
      }
    )
  }

  return {
    updateDataFromInfiniteQuery,
    insertIntoInfiniteQuery,
    removeDataFromInfiniteQuery
  }
}

export default useQueryUpdater

