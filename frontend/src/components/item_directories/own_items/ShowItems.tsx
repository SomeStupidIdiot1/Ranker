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
} from "@material-ui/core";
import {
  getSpecificTemplate,
  SpecificTemplate,
  deleteTemplate,
  deleteItem,
  updateItem,
  updateTemplate,
} from "../../../services/template";
import Page from "../../helpers/Page";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ConfirmDialog from "../../helpers/ConfirmDialog";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import AddItems from "../make_template/AddItems";
import PopUp from "../../helpers/PopUp";

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
  const templateId = (match.params as { id: string | number }).id;
  const classes = useStyles();
  const history = useHistory();
  const [template, setTemplate] = React.useState({
    templateImageUrl: "",
    createdOn: "",
    lastUpdated: "",
  });
  const [title, setTitle] = React.useState("Loading...");
  const [info, setInfo] = React.useState("Loading...");
  const [items, setItems] = React.useState<SpecificTemplate["items"]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditMode, setEditMode] = React.useState(false);
  const [isAddMode, setAddMode] = React.useState(false);
  const [deleteList, setDeleteList] = React.useState<Set<number>>(new Set());
  const [err, setErr] = React.useState("");
  const deleteTemplateAction = () => {
    deleteTemplate(templateId).then(() => history.push("/myitems"));
  };
  React.useEffect(() => {
    getSpecificTemplate(templateId).then(({ data }) => {
      setTemplate({
        templateImageUrl: data.templateImageUrl as string,
        createdOn: data.createdOn,
        lastUpdated: data.lastUpdated,
      });
      setTitle(data.title);
      setInfo(data.info);
      setItems(data.items);
    });
  }, [isAddMode, templateId]);
  if (isAddMode) return <AddItems id={templateId} setOpen={setAddMode} />;
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
            <IconButton
              aria-label="rank the items"
              onClick={() => {
                if (items.length >= 2) history.push(`/play/${templateId}`);
                else {
                  setErr("Need at least two items to start ranking");
                }
              }}
            >
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show rankings">
            <IconButton
              aria-label="rankings of items"
              onClick={() => history.push(`/rankings/${templateId}`)}
            >
              <ShowChartIcon fontSize="large" />
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
              onClick={() => {
                if (isEditMode) {
                  items.forEach((item) => {
                    if (!deleteList.has(item.id)) {
                      updateItem(item.id, item.name);
                    } else {
                      deleteItem(item.id);
                    }
                  });
                  updateTemplate(templateId, title, info).then(({ data }) => {
                    setTemplate({ ...template, lastUpdated: data.updatedTime });
                  });
                }
                setEditMode(!isEditMode);
              }}
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
              label={`Title`}
              className={classes.titleInput}
              onBlur={(e) => setTitle(e.target.value)}
              onChange={(e) =>
                (e.target.value = e.target.value.substring(0, 50))
              }
              defaultValue={title}
              color="secondary"
            />
          ) : (
            <Typography component="h1" variant="h4" noWrap>
              {title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          {isEditMode && (
            <TextField
              variant="outlined"
              label={`Description`}
              className={classes.descInput}
              fullWidth
              multiline
              rows={5}
              onBlur={(e) => setInfo(e.target.value)}
              onChange={(e) =>
                (e.target.value = e.target.value.substring(0, 300))
              }
              defaultValue={info}
              color="secondary"
            />
          )}
          {!isEditMode && info.trim() && (
            <Typography
              component="p"
              variant="body1"
              style={{ wordWrap: "break-word" }}
            >
              <b>Description: </b>
              {info}
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

        {items
          .filter(({ id }) => !deleteList.has(id))
          .map(({ id, itemImageUrl, name }, index) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                <CardContent>
                  {isEditMode ? (
                    <TextField
                      variant="outlined"
                      label={`Name`}
                      className={classes.descInput}
                      style={{ width: "100%" }}
                      onBlur={(e) => {
                        const copy = [...items];
                        copy[index] = {
                          ...copy[index],
                          name: e.target.value,
                        };
                        setItems(copy);
                      }}
                      onChange={(e) =>
                        (e.target.value = e.target.value.substring(0, 40))
                      }
                      defaultValue={name}
                      color="secondary"
                    />
                  ) : (
                    <Typography component="h4" variant="body1" noWrap>
                      {name}
                    </Typography>
                  )}
                </CardContent>
                {itemImageUrl && (
                  <img
                    alt={name}
                    src={itemImageUrl as string}
                    style={{ maxHeight: 400, width: "100%" }}
                  />
                )}
                {isEditMode && (
                  <Tooltip title="Delete this item">
                    <IconButton
                      aria-label="delete item"
                      onClick={() => {
                        const copy = new Set(deleteList);
                        copy.add(id);
                        setDeleteList(copy);
                      }}
                      style={{
                        display: "block",
                        margin: "auto",
                        position: "relative",
                      }}
                    >
                      <DeleteIcon className={classes.delete} />
                    </IconButton>
                  </Tooltip>
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
      <PopUp message={err} setMessage={setErr} severity="error" />
    </Page>
  );
};
