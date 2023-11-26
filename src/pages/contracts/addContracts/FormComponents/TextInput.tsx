import { Stack, Typography, TextField } from "@mui/material";
function TextInput(props: PropsType) {
  return (
    <>
      <Stack>
        <Typography sx={{ ml: 2 }} component="label">
          {props.title}
        </Typography>
        <TextField
          id="outlined-phone-input"
          type="text"
          required
          size="small"
          placeholder={props.title}
          onChange={(e) => {}}
        />
      </Stack>
    </>
  );
}

type PropsType = {
  title: string;
};

export default TextInput;
