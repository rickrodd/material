import React, { useState } from "react";
import { 
  TextField, Button, Card, CardContent, Typography, 
  Stack, FormControlLabel, Switch, Avatar, ListItem, ListItemAvatar, ListItemText 
} from "@mui/material";

const CommentBox = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [anonymous, setAnonymous] = useState(false);

  const userName = "Your Name";  

  const handleSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        isAnonymous: anonymous,
        timestamp: new Date().toLocaleString(), // Using built-in JavaScript method
      };
      setComments([ newComment, ...comments ]);
      setComment("");
    }
  };

  return (
    <Card sx={{ maxWidth: 500, p: 2, borderRadius: 2, boxShadow: 3, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Leave a Comment
        </Typography>

        {/* Toggle for Anonymous Mode */}
        <FormControlLabel
          control={
            <Switch
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
              color="primary"
            />
          }
          label="Submit Anonymously"
          sx={{ mb: 1 }}
        />

        {/* Show warning when in anonymous mode */}
        {anonymous && (
          <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
            Anonymous comments are harder to address. Consider submitting with your name.
          </Typography>
        )}

        {/* Comment Input Field */}
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Type your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button variant="contained" onClick={handleSubmit} disabled={!comment.trim()}>
          Submit
        </Button>

        {/* Comment List */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          {comments.map((c, index) => (
            <Card key={index} sx={{ p: 1, backgroundColor: "#f5f5f5" }}>
              <ListItem alignItems="flex-start">
                {/* Avatar */}
                <ListItemAvatar>
                  <Avatar>{c.isAnonymous ? "A" : userName.charAt(0)}</Avatar>
                </ListItemAvatar>

                {/* Comment Content with Timestamp Fix */}
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" color="text.primary">
                      {c.isAnonymous ? "Anonymous" : userName}{" "}
                      <Typography component="span" variant="caption" color="text.secondary">
                        ({c.timestamp})
                      </Typography>
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2">{c.text}</Typography>
                  }
                />
              </ListItem>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CommentBox;
