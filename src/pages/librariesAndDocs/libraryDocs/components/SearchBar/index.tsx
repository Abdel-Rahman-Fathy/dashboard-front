import { Button, Stack, TextField } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useContext, useState } from "react";
import { LibraryDocumentionContext } from "../../context/LibraryDocumentionContext";

export default function LibraryDocsSearch() {
  // TODO::declare and define component state and variables
  const [name, setName] = useState("");
  const { handleSearch } = useContext(LibraryDocumentionContext);
  // TODO::declare and define component methods
  // TODO::return component view
  return (
    <Stack
      direction="row"
      component={"form"}
      onSubmit={() => {}}
      justifyContent={"center"}
      alignItems={"center"}
      gap={1}
    >
      {/* document num */}
      <TextField
        label="بحث"
        // value={props.search}
        size="small"
        sx={{ flexGrow: 1 }}
        onChange={(e) => setName(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={() => {
          handleSearch(name);
        }}
        sx={{
          transition: "transform 0.2s ease-in-out",
          ":hover": {
            transform: "scale(1.0789)",
          },
        }}
      >
        بحث
      </Button>
      <Button
        variant="outlined"
        startIcon={<FilterAltIcon />}
        sx={{
          transition: "transform 0.2s ease-in-out",
          ":hover": {
            transform: "scale(1.0789)",
          },
        }}
      >
        فلتر
      </Button>
    </Stack>
  );
}
