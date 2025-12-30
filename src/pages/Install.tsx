import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";
import { Download, Smartphone, CheckCircle, Globe, Zap, WifiOff } from "lucide-react";

export default function Install() {
  const { isInstalled, isInstallable, installApp } = usePWA();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log("App installed successfully!");
    }
  };

  return (
    <AppLayout title="Installer JuridiDesk" subtitle="Accédez à l'app depuis votre écran d'accueil">
      <div className="max-w-2xl mx-auto space-y-6">
        {isInstalled ? (
          <Card className="border-green-500/50 bg-green-500/10">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-500">Application installée !</CardTitle>
              <CardDescription>
                JuridiDesk est maintenant disponible sur votre écran d'accueil.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="text-center">
                <Smartphone className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle>Installez JuridiDesk</CardTitle>
                <CardDescription>
                  Installez l'application pour un accès rapide et une expérience optimale.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isInstallable ? (
                  <Button onClick={handleInstall} size="lg" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Installer l'application
                  </Button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Pour installer l'application :
                    </p>
                    <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                      <p className="font-medium">Sur iPhone/iPad :</p>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                        <li>Appuyez sur le bouton Partager (carré avec flèche)</li>
                        <li>Faites défiler et sélectionnez "Sur l'écran d'accueil"</li>
                        <li>Appuyez sur "Ajouter"</li>
                      </ol>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                      <p className="font-medium">Sur Android :</p>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                        <li>Appuyez sur le menu (trois points)</li>
                        <li>Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Accès rapide</h3>
                  <p className="text-sm text-muted-foreground">
                    Lancez l'app depuis votre écran d'accueil
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <WifiOff className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Mode hors-ligne</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez vos données sans connexion
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Plein écran</h3>
                  <p className="text-sm text-muted-foreground">
                    Expérience immersive sans barre de navigation
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
