import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  "Data Structures": ["linked list", "stack", "queue", "tree", "graph", "binary", "heap", "hash", "array", "sorting", "searching", "bfs", "dfs", "traversal", "inorder", "preorder", "postorder", "avl", "b-tree", "red-black", "bubble sort", "merge sort", "quick sort", "insertion sort", "selection sort", "time complexity", "space complexity", "big o", "recursion", "dynamic programming", "greedy"],
  "C/C++": ["pointer", "malloc", "calloc", "realloc", "free", "struct", "union", "typedef", "preprocessor", "macro", "header file", "iostream", "cin", "cout", "class", "object", "inheritance", "polymorphism", "encapsulation", "virtual", "template", "stl", "vector", "constructor", "destructor", "operator overloading", "friend function", "c programming", "c++"],
  "DBMS": ["sql", "query", "database", "table", "normalization", "1nf", "2nf", "3nf", "bcnf", "join", "primary key", "foreign key", "index", "transaction", "acid", "concurrency", "deadlock", "er diagram", "relational", "schema", "ddl", "dml", "dcl", "select", "insert", "update", "delete", "group by", "having", "aggregate"],
  "Operating Systems": ["process", "thread", "scheduling", "deadlock", "mutex", "semaphore", "memory management", "paging", "segmentation", "virtual memory", "page fault", "page replacement", "lru", "fifo", "fcfs", "sjf", "round robin", "priority", "context switch", "ipc", "critical section", "race condition", "fork", "exec", "file system", "cpu scheduling"],
  "Discrete Mathematics": ["set theory", "relation", "function", "graph theory", "boolean", "logic", "proposition", "predicate", "quantifier", "proof", "induction", "recurrence", "combinatorics", "permutation", "combination", "lattice", "poset", "group", "ring", "field", "isomorphism", "homomorphism", "euler", "hamilton", "chromatic", "spanning tree"],
  "Physics": ["newton", "motion", "force", "velocity", "acceleration", "momentum", "energy", "work", "power", "thermodynamics", "heat", "temperature", "wave", "optics", "lens", "mirror", "reflection", "refraction", "electric", "magnetic", "current", "voltage", "resistance", "capacitor", "inductor", "electromagnetic", "quantum", "relativity", "gravity", "friction", "oscillation", "pendulum", "frequency", "wavelength"],
  "Chemistry": ["atom", "molecule", "element", "compound", "reaction", "bond", "ionic", "covalent", "oxidation", "reduction", "acid", "base", "ph", "mole", "stoichiometry", "organic", "inorganic", "polymer", "catalyst", "equilibrium", "electrochemistry", "thermochemistry", "periodic table", "valence", "electron", "proton", "neutron", "isotope", "isomer", "hydrocarbon", "alkane", "alkene", "alkyne", "aldehyde", "ketone", "alcohol", "ester"],
  "Mathematics": ["algebra", "calculus", "derivative", "integral", "differential", "equation", "matrix", "vector", "trigonometry", "geometry", "coordinate", "limit", "continuity", "polynomial", "quadratic", "linear", "exponential", "logarithm", "sequence", "series", "convergence", "divergence", "probability", "statistics", "mean", "median", "variance", "standard deviation", "hypothesis", "regression"],
  "Biology": ["cell", "dna", "rna", "protein", "gene", "chromosome", "mitosis", "meiosis", "photosynthesis", "respiration", "enzyme", "metabolism", "organism", "evolution", "ecosystem", "biodiversity", "taxonomy", "anatomy", "physiology", "genetics", "heredity", "mutation", "virus", "bacteria", "immunity", "hormone", "neuron", "organ"],
  "Computer Networks": ["tcp", "udp", "ip", "http", "https", "ftp", "dns", "dhcp", "router", "switch", "hub", "osi", "layer", "protocol", "packet", "bandwidth", "latency", "firewall", "vpn", "lan", "wan", "ethernet", "wifi", "socket", "port", "subnet", "gateway", "arp", "icmp", "ssl", "tls"]
};

function detectSubject(question: string): string {
  const lowerQuestion = question.toLowerCase();
  let maxScore = 0;
  let detectedSubject = "General";

  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword)) {
        score += keyword.split(" ").length; // Multi-word keywords get higher score
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedSubject = subject;
    }
  }

  return detectedSubject;
}

function getSystemPrompt(mode: "exam" | "simple"): string {
  const basePrompt = `You are an experienced exam evaluator and teacher with 15+ years of experience across various university patterns worldwide. You help students write perfect exam answers for any subject.

CRITICAL RULES:
1. Structure answers exactly as expected in university exams
2. Use proper headings, subheadings, and numbered points
3. Include diagrams using ASCII art when helpful (especially for technical concepts)
4. Focus on marks-oriented writing - cover all expected points
5. Be concise but complete - no unnecessary fluff
6. Use bullet points for definitions and short answers
7. For numerical problems, show step-by-step solutions
8. Highlight key terms that examiners look for
9. Include examples where appropriate
10. Adapt your answer style to the subject (scientific notation for Physics/Chemistry, formal proofs for Math, etc.)`;

  if (mode === "exam") {
    return `${basePrompt}

FORMAT YOUR RESPONSE FOR EXAM PAPER:
- Start with a brief definition (1-2 lines) if applicable
- Use proper headings: ## for main sections, ### for subsections
- Number your points clearly (1., 2., 3. or a., b., c.)
- Include ASCII diagrams for visual concepts
- End with advantages/disadvantages or applications if relevant
- Keep language formal and technical
- Aim for the complete answer a topper would write

Mark allocation guide:
- 2 marks: Definition + 2-3 key points
- 5 marks: Definition + explanation + example/diagram
- 10 marks: Comprehensive answer with all aspects covered`;
  } else {
    return `${basePrompt}

EXPLAIN IN SIMPLE TERMS:
- Use everyday analogies and examples
- Break complex concepts into small, digestible pieces  
- Use simple language a first-year student would understand
- Still maintain accuracy - just make it easier to grasp
- Include "Think of it like..." comparisons
- Use bullet points for clarity
- Add ASCII diagrams only when they genuinely help understanding`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, mode = "exam" } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const detectedSubject = detectSubject(question);
    const systemPrompt = getSystemPrompt(mode as "exam" | "simple");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Subject: ${detectedSubject}\n\nQuestion: ${question}\n\nProvide a complete, well-structured answer.` 
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment.", subject: detectedSubject }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later.", subject: detectedSubject }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate answer. Please try again.", subject: detectedSubject }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the stream with subject info prepended
    const encoder = new TextEncoder();
    const subjectEvent = `data: ${JSON.stringify({ subject: detectedSubject })}\n\n`;
    
    const stream = new ReadableStream({
      async start(controller) {
        // Send subject first
        controller.enqueue(encoder.encode(subjectEvent));
        
        // Pipe the AI response
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("exam-buddy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
