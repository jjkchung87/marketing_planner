// Chatbot component
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import UserApi from '../../api'; // Assuming this is where your chatbot function is
import { ChatResponseType } from '../../types/types';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const ChatBox: React.FC = () => {
    const [userInput, setUserInput] = useState<string>('');
    const [conversation, setConversation] = useState<ChatResponseType['response'][]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!userInput.trim()) return;
    
        const userMessage = {
            input: userInput,
            output: '' // Assuming userMessage has the same structure as response
        };
    
        try {
            const response = await UserApi.chatbot({ prompt: userInput });
            if (response && response.response) {
                
                setConversation([...conversation, userMessage, response.response]);
            }
            setUserInput('');
        } catch (error) {
            console.error('Error in sending message to chatbot:', error);
        }
    };
    

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>AI Chatbot</Typography>
            <Paper sx={{ maxHeight: 300, overflow: 'auto', mb: 2, p: 2 }}>
                <List>
                    {conversation.map((message, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={message.output ? `AI 🤖 : ${message.output}` : `You 👤: ${message.input}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    label="Ask a question"
                    value={userInput}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                />
                <Button variant="contained" color="primary" type="submit">
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatBox;
