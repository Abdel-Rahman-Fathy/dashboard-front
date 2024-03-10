import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Loader from "../../../../../components/Loading/Loader";
import AddLabelToEl from "../../../../../components/AddLabelToEl";
import { CloudUpload, Edit } from "@mui/icons-material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./index.scss";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Contract } from "../../../../../types";
import { Api } from "../../../../../constants";
import { useParams } from "react-router-dom";
import ContractAddUsersSelect from "./SelectFromUsers";
import GDicon from "../../../../../assets/images/GDicon.png";
import SinglePand from "./SinglePand";
import { useSnackbar } from "notistack";
import { serialize } from "object-to-formdata";
import { LoadingButton } from "@mui/lab";
import SelectWithFilter from "../../../../../components/SelectWithFilter";

// * define our component type
type FormHeaders = {
  name: string;
  description: string;
  manager_id: string;
  contract_id: string;
  start_date: string;
  end_date: string;
  sub_items: [];
};
type PandT = {
  name: string;
  eng_id: number | undefined;
  is_percent: boolean;
  is_treatment: boolean;
  is_attachment: boolean;
};
type editedDataType = {
  id: number;
  contract_id: number;
  name: string;
  contract_item_employees: [];
  contract_sub_items: {
    name: string;
    employee_id: string;
    is_progress_bar: "1" | "0";
    is_processing: "1" | "0";
    is_attachment: "1" | "0";
  }[];
  created_at: string;
  description: string;
  manager_id: string;
  media: {
    id: number;
    file_name: string;
    size: number;
    original_url: string;
  }[];
  start_date: string;
  end_date: string;
  sub_items: SubItem[];
  attachments: File[];
};
type SubItem = {
  name: string;
  employee_id: string;
  is_progress_bar: "1" | "0";
  is_processing: "1" | "0";
  is_attachment: "0" | "1";
};

export default function TermsAndTasksOFContract(props: propsType) {
  // TODO::declare our state var...
  const [loading, setLoading] = useState(false);
  const [datesError, setDatesError] = useState(false);
  const [editIstanceId, setEditIstanceId] = useState<number | undefined>(
    undefined
  );
  const [editedData, setEditedData] = useState<editedDataType>();
  const [mediaFiles, setMediaFiles] = useState<
    {
      id: number;
      file_name: string;
      size: number;
      original_url: string;
    }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [mangeredId, setMangeredId] = useState<number>();
  const { enqueueSnackbar } = useSnackbar();
  const [mainFieldsShow, setMainFieldsShow] = useState({
    pandName: false,
    pandDescription: false,
    taskManager: false,
  });
  const [engineers, setEngineers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [setselectedEngineeras, setSetselectedEngineeras] = useState<
    { id: number; name: string }[]
  >([]);
  const [subPands, setSubPands] = useState<PandT[]>([
    {
      name: "",
      eng_id: undefined,
      is_attachment: false,
      is_percent: false,
      is_treatment: false,
    },
  ]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
    setValue,
    getValues,
  } = useForm<FormHeaders>({
    defaultValues: {},
  });
  let { id } = useParams();
  if (!id) {
    id = props.contractId?.toString();
  }

  // TODO::fetch data of selects
  useEffect(() => {
    setLoading(true);
    type Enginee = { id: number; name: string };
    axios
      .post<{ data: Enginee[] }>(Api(`employee/employees`))
      .then((res) => {
        setEngineers(res?.data?.data);
      })
      .catch((err) => {
        console.log("Error in fetch data:", err);
      })
      .finally(() => setLoading(false));
  }, []);
  // TODO::fetch data of contract if Edit Approach
  useEffect(() => {
    if (props.edit) {
      setLoading(true);
      axios
        .get(Api(`employee/contract/${id}`))
        .then((res) => {
          console.log(
            "Breakpoint101XZ in details page:",
            res.data.data.contract_items[0],
            engineers.filter(
              (ele) => ele.id == res.data.data.contract_items[0].manager_id
            )
          );
          setEditedData(res.data.data.contract_items[0]);
        })
        .catch((err) => {
          console.log("Error101 :-", err);
          enqueueSnackbar("تعذر تحميل الداتا", { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [props.edit]);

  useEffect(() => {
    if (editedData) {
      reset({
        name: editedData.name,
        description: editedData.description,
        manager_id: editedData.manager_id,
        start_date: editedData.start_date?.slice(0, 10),
        end_date: editedData.end_date?.slice(0, 10),
      });
      setMangeredId(+editedData.manager_id);
      setMediaFiles(editedData.media);

      setSubPands(
        editedData?.contract_sub_items.map((ele) => {
          return {
            name: ele.name,
            eng_id: +ele.employee_id,
            is_percent: ele.is_progress_bar == "1" ? true : false,
            is_treatment: ele.is_processing == "1" ? true : false,
            is_attachment: ele.is_attachment == "1" ? true : false,
          };
        })
      );
      setMainFieldsShow({
        pandName: editedData.name ? true : false,
        pandDescription: editedData.description ? true : false,
        taskManager: editedData.manager_id ? true : false,
      });
    }
  }, [props.edit, editedData]);

  // TODO::define my functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Files :-", files);
    setInputFiles(files);
  };

  const removeFile = (idx: number) => {
    if (inputFiles && inputFiles.length) {
      let arr = Array.from(inputFiles).filter((f, i) => i != idx);
      setInputFiles(arr as unknown as FileList);
    }
  };

  const handleFormSubmit = handleSubmit((formData) => {
    // setLoading(true);
    let data = {
      name: formData.name,
      description: formData.description,
      manager_id: formData.manager_id,
      contract_id: id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      sub_items: subPands.map((ele) => ({
        employee_id: ele.eng_id,
        is_progress_bar: ele.is_percent ? 1 : 0,
        is_processing: ele.is_treatment ? 1 : 0,
        is_attachment: ele.is_attachment ? 1 : 0,
        name: ele.name,
      })),
      attachments: inputFiles,
      // contract_item_employees: setselectedEngineeras.map((ele) => ele.id),
    };
    console.log("formData :-", data, formData, subPands);
    return new Promise((resolve, reject) => {
      (!editIstanceId
        ? axios.post(
            Api(`employee/contract/items/store`),
            serialize(data, { indices: true })
          )
        : axios.post(
            Api(`employee/contract/items/${editIstanceId}`),
            serialize(data, { indices: true })
          )
      )
        .then((res) => {
          console.log("response101", res);
          if (editIstanceId)
            enqueueSnackbar("تم تعديل بنود و مهام العقد بنجاح");
          else enqueueSnackbar("تم حفظ بنود و مهام العقد بنجاح");
          resolve(res);
        })
        .catch((err) => {
          console.log("Error101 :-", err);
          enqueueSnackbar("تعذر الحفظ", { variant: "error" });
          reject(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  });

  // TODO::handle ui cases
  if (loading)
    //*Loading State
    return (
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "95%",
          background: "#80808091",
          zIndex: 1500,
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader title="جاري تحميل بيانات العقد" />
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "baseline",
      }}
      id={"ContractTermsAndTasks"}
      component="form"
      onSubmit={handleFormSubmit}
      noValidate
      autoComplete="on"
    >
      {isSubmitting && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "95%",
            background: "#80808091",
            zIndex: 10,
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader title="جاري تحميل بيانات العقد" />
        </Box>
      )}
      {/* Top/main Fields */}
      <Box
        sx={{
          backgroundColor: "#fff",
          width: "95%",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "12px",
        }}
      >
        {/* Pand Name */}
        <Box>
          <AddLabelToEl row label="عنوان البند">
            <TextField
              fullWidth
              placeholder="انجاز الاعمال بأمانة جدة"
              variant="standard"
              sx={{
                width: mainFieldsShow.pandName ? "70%" : "4%",
                transition: "width 0.4s ease",
              }}
              disabled={isSubmitting}
              {...register("name")}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      let targetVal =
                        getValues("name")?.trim().length == 0
                          ? !mainFieldsShow.pandName
                          : true;
                      setMainFieldsShow((prev) => ({
                        ...prev,
                        pandName: targetVal,
                      }));
                    }}
                  >
                    <Edit />
                  </IconButton>
                ),
              }}
            />
          </AddLabelToEl>
        </Box>
        {/* Pand Description */}
        <Box>
          <AddLabelToEl row label="الوصف">
            <TextField
              fullWidth
              variant="standard"
              sx={{
                width: mainFieldsShow.pandDescription ? "70%" : "4%",
                transition: "width 0.4s ease",
              }}
              disabled={isSubmitting}
              {...register("description")}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      let targetVal =
                        getValues("description")?.trim().length == 0
                          ? !mainFieldsShow.pandDescription
                          : true;
                      setMainFieldsShow((prev) => ({
                        ...prev,
                        pandDescription: targetVal,
                      }));
                    }}
                  >
                    <Edit />
                  </IconButton>
                ),
              }}
            />
          </AddLabelToEl>
        </Box>
        {/* Task Manager */}
        <Box>
          <AddLabelToEl row label={`اختيار مدير المهمة`}>
            <Controller
              name="manager_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-select-currency"
                  size="small"
                  select
                  variant="standard"
                  value={mangeredId?.toString()}
                  // value={editedData?.manager_id ? +editedData?.manager_id : ""}
                  sx={{
                    width: mainFieldsShow.taskManager ? "70%" : "4%",
                    transition: "width 0.4s ease",
                  }}
                  disabled={isSubmitting}
                  fullWidth
                  placeholder="اختيار مدير المهمة"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        color="secondary"
                        sx={{
                          marginX: "1rem",
                        }}
                        onClick={() => {
                          let targetVal =
                            typeof getValues("manager_id") == "string"
                              ? !mainFieldsShow.taskManager
                              : true;
                          setMainFieldsShow((prev) => ({
                            ...prev,
                            taskManager: targetVal,
                          }));
                        }}
                      >
                        <Edit />
                      </IconButton>
                    ),
                  }}
                  onChange={(e) => {
                    console.log("TargetVal:", e.target.value);
                    setMangeredId(+e.target.value);
                  }}
                >
                  {engineers?.map((employee) => (
                    <MenuItem
                      key={`ele_${employee.id}_${Math.random()}`}
                      value={employee.id}
                    >
                      {employee.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </AddLabelToEl>
        </Box>
      </Box>
      {/* Start/end Dates */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          bgcolor: "white",
          width: "95%",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "12px",
        }}
        xs={12}
      >
        <Grid
          item
          xs={6}
          sx={{
            alignItems: "start",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>تاريخ البداية</Typography>
          <TextField
            type="date"
            fullWidth
            disabled={isSubmitting}
            {...register("start_date")}
            onChange={(e) => {
              if (getValues("end_date")) {
                let d2 = new Date(getValues("end_date"));
                let d1 = new Date(e.target.value);
                if (d1 > d2) {
                  setDatesError(true);
                } else {
                  setDatesError(false);
                }
              }
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            alignItems: "start",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>تاريخ الانتهاء</Typography>
          <TextField
            disabled={isSubmitting}
            type="date"
            fullWidth
            {...register("end_date")}
            onChange={(e) => {
              console.log("Date:", e.target.value, getValues("start_date"));
              if (getValues("start_date")) {
                let d1 = new Date(getValues("start_date"));
                let d2 = new Date(e.target.value);
                if (d1 > d2) {
                  setDatesError(true);
                } else {
                  setDatesError(false);
                }
              }
            }}
          />
        </Grid>
        {datesError && (
          <Typography color="error" textAlign="center" sx={{ width: "100%" }}>
            التواريخ المدخله غير صحيحة [تاريخ البداية اكبر من لتاريخ
            النهاية]برجاء مراجعتها.
          </Typography>
        )}
      </Grid>
      {/* Add users */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          width: "95%",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "12px",
          justifyContent: "center",
          alignItems: "start",
        }}
        xs={12}
      >
        <Typography variant="h6">اضافة مستخدمين للمهام</Typography>
        <ContractAddUsersSelect
          disabled={isSubmitting}
          users={engineers}
          setValue={setSetselectedEngineeras}
        />
      </Grid>
      {/* Attachments */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          width: "95%",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "12px",
          justifyContent: "center",
          alignItems: "start",
        }}
        xs={12}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          bgcolor="white"
          padding={2}
          borderRadius={1}
          style={{ marginLeft: -5 }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center" flex={1}>
              <Box>
                <Typography>المرفقات</Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              flex={1}
              style={{ cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Box>
                <Box
                  border="1px dashed #ccc"
                  display="flex"
                  alignItems="center"
                  marginRight="10px"
                  style={{ cursor: "pointer" }}
                >
                  <Box padding="5px" marginRight="10px">
                    <CloudUpload />
                  </Box>
                  <Box>
                    <Typography variant="body2">اضافة المرفقات</Typography>
                    <Typography variant="caption">
                      الصيغ المناسبة PNG - PDF - JPG
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleInputChange}
              />
            </Box>
            <Box display="flex" alignItems="center" flex={1}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginLeft="10px"
              >
                <Typography>أو استخراج من الدرايف</Typography>
                <IconButton onClick={() => {}}>
                  <img
                    src={GDicon}
                    alt="Google Drive"
                    style={{ width: 40, height: 40 }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display:
                  !inputFiles && mediaFiles.length == 0 ? "none" : "flex",
                width: inputFiles && inputFiles.length > 2 ? "50%" : "25%",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {inputFiles &&
                inputFiles?.length > 0 &&
                Array.from(inputFiles).map((item, idx) => {
                  return (
                    <Box
                      key={`${idx}_${item.name}_${item?.size}`}
                      sx={{
                        width: "47%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        padding: "0.2rem",
                        borderRadius: "8px",
                        marginY: "0.2rem",
                      }}
                    >
                      <DescriptionIcon />
                      <Box>
                        <Typography variant="body1" fontSize={13}>
                          {item.name.slice(0, Math.min(18, item.name.length))}
                          {(item.name?.length || 0) > 18 ? ".." : ""}
                        </Typography>
                        <Typography variant="body1" fontSize={10}>
                          {new Date().toLocaleDateString()} ,{" "}
                          {Math.round((item?.size || 0) / 1024)} MB
                        </Typography>
                      </Box>
                      <DeleteOutlineOutlinedIcon
                        onClick={() => removeFile(idx)}
                        sx={{
                          transition: "all 0.5 ease",
                          cursor: "pointer",
                          ":hover": {
                            color: "red",
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              {mediaFiles.map((item, idx) => {
                return (
                  <Box
                    key={`${idx}_${item.file_name}_${item?.size}`}
                    sx={{
                      width: "47%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#fff",
                      padding: "0.2rem",
                      borderRadius: "8px",
                      marginY: "0.2rem",
                    }}
                  >
                    <DescriptionIcon />
                    <Box>
                      <Typography variant="body1" fontSize={13}>
                        {item.file_name.slice(
                          0,
                          Math.min(18, item.file_name.length)
                        )}
                        {(item.file_name?.length || 0) > 18 ? ".." : ""}
                      </Typography>
                      <Typography variant="body1" fontSize={10}>
                        {new Date().toLocaleDateString()} ,{" "}
                        {Math.round((item?.size || 0) / 1024)} MB
                      </Typography>
                    </Box>
                    <DeleteOutlineOutlinedIcon
                      onClick={() => removeFile(idx)}
                      sx={{
                        transition: "all 0.5 ease",
                        cursor: "pointer",
                        ":hover": {
                          color: "red",
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Grid>
      {/* Sub Items */}
      {subPands.map((pand, idx) => {
        return (
          <SinglePand
            disabled={isSubmitting}
            key={`pand_${idx}_${Math.random()}`}
            users={setselectedEngineeras}
            subPandsArr={subPands}
            setPandData={setSubPands}
            idx={idx}
          />
        );
      })}

      {/* Add anthor Pand */}
      <Grid container xs={12} sx={{ width: "95%" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddBoxOutlinedIcon />}
          style={{
            backgroundColor: "#d0dce9",
            color: "#0c4f98",
            justifyContent: "flex-start",
          }}
          disabled={isSubmitting}
          onClick={() => {
            setSubPands((prev) => [
              ...prev,
              {
                name: "",
                eng_id: undefined,
                is_attachment: false,
                is_percent: false,
                is_treatment: false,
              },
            ]);
          }}
        >
          <div dir="rtl">اضافة بند فرعي اخر</div>
        </Button>
      </Grid>
      {/* Save */}
      <Grid item xs={1} marginY={4}>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {props.edit ? "تعديل" : "حفظ"}
        </LoadingButton>
      </Grid>
    </Box>
  );
}

type propsType = {
  contractId: number | undefined;
  edit: boolean;
};
