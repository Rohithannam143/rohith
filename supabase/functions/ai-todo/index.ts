import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userEmail, todoDescription, todoId } = await req.json();

    if (action === 'generate') {
      // AI generates todo suggestions
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful AI assistant that generates actionable todo items. Generate 3-5 clear, specific, and achievable tasks based on user input. Format each task as a JSON object with title, description, and priority (low/medium/high).' 
            },
            { role: 'user', content: todoDescription }
          ],
        }),
      });

      const data = await response.json();
      const suggestions = data.choices[0].message.content;

      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'notify') {
      // Send email notification using Resend API
      const { title, priority, dueDate } = await req.json();

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Todo Assistant <onboarding@resend.dev>',
          to: [userEmail],
          subject: `Todo Reminder: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">📋 Todo Reminder</h2>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-top: 0;">${title}</h3>
                <p style="color: #666; margin: 5px 0;">
                  <strong>Priority:</strong> 
                  <span style="color: ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#f59e0b' : '#10b981'};">
                    ${priority.toUpperCase()}
                  </span>
                </p>
                ${dueDate ? `<p style="color: #666; margin: 5px 0;"><strong>Due:</strong> ${new Date(dueDate).toLocaleDateString()}</p>` : ''}
              </div>
              <p style="color: #666;">Don't forget to complete this task!</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated reminder from your Todo Assistant
              </p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }

      const emailData = await emailResponse.json();
      console.log('Email sent:', emailData);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-todo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});