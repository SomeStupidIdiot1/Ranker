import reactRouterDom, { useHistory } from "react-router-dom";
import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  Grid,
  Card,
  Tooltip,
  IconButton,
  CardContent,
  TextField,
  Box,
} from "@material-ui/core";
import {
  getSpecificTemplate,
  SpecificTemplate,
  deleteTemplate,
} from "../../../services/template";
import Page from "../../helpers/Page";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ConfirmDialog from "../../helpers/ConfirmDialog";
import AddItems from "../make_template/AddItems";
const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  root: {
    height: "100%",
  },
  titleInput: { width: "50%" },
  descInput: { width: "50%" },
  button: {
    marginBottom: theme.spacing(2),
  },
  img: {
    maxHeight: 400,
    width: "100%",
  },
  active: {
    color: theme.palette.info.main,
  },
  iconBar: {
    display: "grid",
    justifyContent: "center",
    gridAutoFlow: "column",
  },
  delete: {
    color: theme.palette.warning.main,
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const classes = useStyles();
  const history = useHistory();
  const [template, setTemplate] = React.useState<SpecificTemplate>({
    title: "Loading...",
    info: "Loading...",
    templateImageUrl: null,
    createdOn: "",
    lastUpdated: "",
    items: [],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditMode, setEditMode] = React.useState(false);
  const [isAddMode, setAddMode] = React.useState(false);
  const [deleteList, setDeleteList] = React.useState<Set<number>>(new Set());
  const deleteTemplateAction = () => {
    deleteTemplate((match.params as { id: string | number }).id).then(() =>
      history.push("/myitems")
    );
  };
  React.useEffect(() => {
    const id = (match.params as { id: string }).id;
    getSpecificTemplate(id).then(({ data }) => {
      setTemplate(data);
    });
  }, [match.params, isAddMode]);
  if (isAddMode)
    return (
      <AddItems id={(match.params as { id: string }).id} setOpen={setAddMode} />
    );
  return (
    <Page
      maxWidth={false}
      paperStyles={(theme: Theme) => ({
        marginLeft: theme.spacing(8),
        marginRight: theme.spacing(2),
      })}
      containerStyles={(_) => ({
        display: "grid",
      })}
    >
      <Grid container spacing={2} justify="flex-start">
        <Grid item xs={12} className={classes.iconBar}>
          <Tooltip title="Rank the items">
            <IconButton aria-label="rank the items">
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add new items">
            <IconButton
              aria-label="add new items"
              onClick={() => setAddMode(true)}
            >
              <AddBoxIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete this template">
            <IconButton
              aria-label="delete template"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit this template">
            <IconButton
              aria-label="edit template"
              onClick={() => setEditMode(!isEditMode)}
            >
              <EditIcon
                fontSize="large"
                className={(isEditMode && classes.active) || undefined}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        {isEditMode && (
          <Grid item xs={12}>
            <Typography>
              <b>Press the edit button again to save</b>
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          {isEditMode ? (
            <TextField
              variant="outlined"
              label={`Title (${
                50 - template.title.length
              } characters remaining)`}
              className={classes.titleInput}
              onChange={(e) =>
                setTemplate({
                  ...template,
                  title: e.target.value.substring(0, 50),
                })
              }
              value={template.title}
              color="secondary"
            />
          ) : (
            <Typography component="h1" variant="h4">
              {template.title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          {isEditMode && (
            <TextField
              variant="outlined"
              label={`Description (${
                300 - template.info.length
              } characters remaining)`}
              className={classes.descInput}
              fullWidth
              multiline
              rows={5}
              onChange={(e) =>
                setTemplate({
                  ...template,
                  info: e.target.value.substring(0, 300),
                })
              }
              value={template.info}
              color="secondary"
            />
          )}
          {!isEditMode && template.info.trim() && (
            <Typography component="p" variant="body1">
              <b>Description: </b>
              {template.info}
            </Typography>
          )}
          {!isEditMode && (
            <>
              <Typography component="p" variant="body1">
                <b>Created On:</b> {new Date(template.createdOn).toString()}
              </Typography>
              <Typography component="p" variant="body1">
                <b>Last Updated:</b> {new Date(template.lastUpdated).toString()}
              </Typography>
            </>
          )}
        </Grid>

        {template.items
          .filter(({ id }) => !deleteList.has(id))
          .map(({ id, itemImageUrl, name }, index) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                <CardContent>
                  {isEditMode ? (
                    <TextField
                      variant="outlined"
                      label={`Name (${40 - name.length} characters remaining)`}
                      className={classes.descInput}
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        const copy = [...template.items];
                        copy[index] = {
                          ...copy[index],
                          name: e.target.value.substring(0, 40),
                        };
                        setTemplate({
                          ...template,
                          items: copy,
                        });
                      }}
                      value={name}
                      color="secondary"
                    />
                  ) : (
                    <Typography component="h4" variant="body1">
                      {name}
                    </Typography>
                  )}
                </CardContent>
                {itemImageUrl && (
                  <img
                    src={itemImageUrl as string}
                    alt={name}
                    className={classes.img}
                  />
                )}
                {isEditMode && (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Delete this item">
                      <IconButton
                        aria-label="delete item"
                        onClick={() => {
                          const copy = new Set(deleteList);
                          copy.add(id);
                          setDeleteList(copy);
                        }}
                      >
                        <DeleteIcon className={classes.delete} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
      </Grid>
      <ConfirmDialog
        title="Delete this template"
        acceptButtonDesc="OK"
        rejectButtonDesc="Go back"
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onAccept={deleteTemplateAction}
      />
    </Page>
  );
};
