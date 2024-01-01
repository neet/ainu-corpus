{
  description = "Deno development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "aarch64-darwin";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShell.aarch64-darwin = pkgs.mkShell {
      shellHook = ''
        export DENO_INSTALL="/tmp/deno"
        export PATH="$DENO_INSTALL/bin:$PATH"
      '';
      buildInputs = [
        pkgs.deno
      ];
    };
  };
}
