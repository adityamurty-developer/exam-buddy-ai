import { Download, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShortNotesModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
}

export function ShortNotesModal({
  open,
  onClose,
  imageUrl,
  isGenerating,
  error,
}: ShortNotesModalProps) {
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "short-notes.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            📋 Short Notes
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">
                Generating your short notes image...
              </p>
              <p className="text-muted-foreground text-xs">
                This may take a few seconds
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-2">{error}</p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {imageUrl && !isGenerating && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-border bg-muted">
                <img
                  src={imageUrl}
                  alt="Short Notes"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
