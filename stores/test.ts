import { Test, ANSWERS } from "@/types";
import { api } from "@/apis";

export const useTestStore = defineStore("test", () => {
  const tests = ref<Test[]>([]);
  const testDetail = ref({});
  const questionDetail = ref([]);

  const getTests = async () => {
    const res = await api.get("/test/list").catch((err) => {
      console.log(err);
      return null;
    });
    tests.value = res?.data || [];
  };

  const getTestDetail = async (id: number) => {
    const res = await api.get(`/test/detail/${id}`).catch((err) => {
      console.log(err);
      return null;
    });
    testDetail.value = res?.data || {};
    questionDetail.value =
      res?.data.questionResponses.map((item: any) => ({
        ...item,
        answers: item.answers.map((answer: any, index: number) => {
          return {
            ...answer,
            label: ANSWERS[index],
          };
        }),
      })) || [];
  };

  const createTest = async (
    subjectCode: string,
    chapterOrders: Array<[]>,
    questionQuantity: number,
    testDay: string,
    duration: number
  ) => {
    const res = await api
      .post("/test/create/random", {
        subjectCode,
        chapterOrders,
        questionQuantity,
        testDay,
        duration,
      })
      .catch((err) => {});
  };

  const createTestCheckbox = async (data: {
    questionIds: number[];
    testDay: string;
    duration: number;
  }) => {
    const res = await api.post("/test/create", data).catch((err) => {});
  };

  const deleteById = async (id: number) => {
    const res = await api.delete(`test/disable/${id}`).catch(() => null);
    if (res !== null) {
      const deletedItemIndex = tests.value.findIndex((item) => item.id === id);
      if (deletedItemIndex > -1) {
        tests.value.splice(deletedItemIndex, 1);
      }
    }
  };

  return {
    tests,
    testDetail,
    questionDetail,
    getTests,
    getTestDetail,
    deleteById,
    createTest,
    createTestCheckbox,
  };
});
